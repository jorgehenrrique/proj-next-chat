import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server } from 'socket.io';
import { instrument } from '@socket.io/admin-ui';
import dotenv from 'dotenv';
import { generateHash } from './generate-hash.js';
import { v4 as uuid } from 'uuid';
import bcrypt from 'bcrypt';

dotenv.config();

const rooms = new Map();
const globalRoom = {
  id: 'global',
  name: 'global',
  isPrivate: false,
  users: new Set(),
};
rooms.set(globalRoom.id, globalRoom);

const randomQueue = new Set();
const activeRandomChats = new Map();
const videoEnabledUsers = new Set();

const {
  PORT,
  ADMIN_USERNAME,
  ROOM_PUBLIC_LIMIT,
  ROOM_PRIVATE_LIMIT,
  CHECK_PUBLIC_ROOMS_INTERVAL,
  CHECK_PRIVATE_ROOMS_INTERVAL,
  PUBLIC_ROOM_LIFETIME,
  PRIVATE_ROOM_LIFETIME,
} = process.env;

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = PORT;
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(async () => {
  const server = createServer((req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    } catch (error) {
      console.error('Error occurred handling', req.url, error);
      res.status(500).send('Internal Server Error');
    }
  });

  const io = new Server(server, {
    cors: {
      origin: ['https://admin.socket.io'],
      credentials: true,
    },
  });

  instrument(io, {
    auth: {
      type: 'basic',
      username: ADMIN_USERNAME,
      password: await generateHash(),
    },
    mode: dev ? 'development' : 'production',
  });

  io.on('connection', (socket) => {
    socket.on('get rooms', () => {
      const publicRooms = Array.from(rooms.values()).filter(
        (room) => !room.isPrivate
      );
      const privateRooms = Array.from(rooms.values()).filter(
        (room) => room.isPrivate
      );
      socket.emit('room list', {
        publicRooms: publicRooms,
        privateRooms: privateRooms,
        publicLimit: +ROOM_PUBLIC_LIMIT,
        privateLimit: +ROOM_PRIVATE_LIMIT,
      });
    });

    socket.on(
      'create room',
      async ({ name, isPrivate, password, creatorId }) => {
        const roomNameExists = Array.from(rooms.values()).some(
          (room) => room.name === name && !room.isPrivate
        );
        let roomLimit = 0;
        let roomSize = 0;
        if (isPrivate) {
          roomLimit = +ROOM_PRIVATE_LIMIT;
          roomSize = Array.from(rooms.values()).filter(
            (room) => room.isPrivate
          ).length;
        } else {
          roomLimit = +ROOM_PUBLIC_LIMIT;
          roomSize = Array.from(rooms.values()).filter(
            (room) => !room.isPrivate
          ).length;
        }
        if (!roomNameExists && roomSize < roomLimit) {
          const roomId = uuid();
          let hashedPassword = null;
          if (isPrivate) hashedPassword = await bcrypt.hash(password, 10);
          const newRoom = {
            id: roomId,
            name,
            isPrivate,
            password: hashedPassword,
            lastActivity: Date.now(),
            users: new Set(),
            creatorId,
          };
          rooms.set(roomId, newRoom);
          io.emit('room list', {
            publicRooms: Array.from(rooms.values()).filter(
              (room) => !room.isPrivate
            ),
            privateRooms: Array.from(rooms.values()).filter(
              (room) => room.isPrivate
            ),
            publicLimit: +ROOM_PUBLIC_LIMIT,
            privateLimit: +ROOM_PRIVATE_LIMIT,
          });
          socket.emit('room created', { id: roomId, name, isPrivate });
        } else if (roomNameExists) {
          socket.emit('room exists', name);
        } else {
          socket.emit('room limit reached');
        }
      }
    );

    // obter informações de uma sala específica
    socket.on('get room', (roomId) => {
      const room = rooms.get(roomId);
      if (room) {
        socket.emit('room info', {
          id: room.id,
          name: room.name,
          isPrivate: room.isPrivate,
          creatorId: room.creatorId,
        });
      } else {
        socket.emit('room info', null);
      }
    });

    // entrar em uma sala privada
    socket.on('join private room', async ({ roomId, password }) => {
      const room = rooms.get(roomId);
      if (
        room &&
        room.isPrivate &&
        (await bcrypt.compare(password, room.password))
      ) {
        socket.emit('join result', true);
      } else {
        socket.emit('join result', false);
      }
    });

    // join room
    socket.on('join room', (roomId) => {
      socket.join(roomId);
      const room = rooms.get(roomId);
      if (room) {
        room.lastActivity = Date.now();
        if (!room.users) room.users = new Set();
        if (!room.users.has(socket.id)) room.users.add(socket.id);
        io.to(roomId).emit('user count', room.users.size);
      }
    });

    // leave room
    socket.on('leave room', (roomId) => {
      socket.leave(roomId);
      const room = rooms.get(roomId);
      if (room && room.users) {
        room.users.delete(socket.id);
        io.to(roomId).emit('user count', room.users.size);
      }
    });

    // message
    socket.on('message', (msg) => {
      io.to(msg.roomId).emit('message', msg);
      const room = rooms.get(msg.roomId);
      if (room) room.lastActivity = Date.now();
    });

    // delete room
    socket.on('delete room', ({ roomId, userId, isAdmin }) => {
      const room = rooms.get(roomId);
      if (
        room &&
        (room.creatorId === userId || isAdmin) &&
        roomId !== 'global'
      ) {
        rooms.delete(roomId);
        io.in(roomId).emit('room deleted', roomId);
        io.in(roomId).disconnectSockets(true);
        io.emit('room list', {
          publicRooms: Array.from(rooms.values()).filter(
            (room) => !room.isPrivate
          ),
          privateRooms: Array.from(rooms.values()).filter(
            (room) => room.isPrivate
          ),
          publicLimit: +ROOM_PUBLIC_LIMIT,
          privateLimit: +ROOM_PRIVATE_LIMIT,
        });
      }
    });

    // disconnect
    socket.on('disconnect', () => {
      handleRandomChatDisconnect(socket.id);
      videoEnabledUsers.delete(socket.id);
      for (const [roomId, room] of rooms) {
        if (room.users && room.users.has(socket.id)) {
          room.users.delete(socket.id);
          io.to(roomId).emit('user count', room.users.size);
        }
      }
    });

    // join random chat events
    socket.on('join random chat', () => {
      randomQueue.add(socket.id);
      matchRandomUsers();
    });

    socket.on('leave random chat', () => {
      handleRandomChatDisconnect(socket.id);
    });

    socket.on('next partner', () => {
      handleRandomChatDisconnect(socket.id);
      randomQueue.add(socket.id);
      matchRandomUsers();
    });

    socket.on('random message', (msg) => {
      const partnerId = activeRandomChats.get(socket.id);
      if (partnerId) {
        io.to(partnerId).emit('random message', msg);
      }
    });
    //

    // video
    socket.on('video enabled', () => {
      videoEnabledUsers.add(socket.id);
      // Se o usuário já estiver na fila, atualiza o matchmaking
      if (randomQueue.has(socket.id)) {
        matchRandomUsers();
      }
    });

    socket.on('video disabled', () => {
      videoEnabledUsers.delete(socket.id);
    });

    socket.on('video signal', ({ signal, to }) => {
      io.to(to).emit('video signal', { signal, from: socket.id });
    });
    //
  });

  // check rooms for inactivity
  const checkAndCleanRooms = (isPrivate) => {
    const currentTime = Date.now();
    const lifetime = isPrivate ? PRIVATE_ROOM_LIFETIME : PUBLIC_ROOM_LIFETIME;

    rooms.forEach((room, roomId) => {
      if (room.isPrivate === isPrivate && roomId !== 'global') {
        const timeSinceLastActivity = currentTime - room.lastActivity;
        if (timeSinceLastActivity > lifetime) {
          console.log(`Removendo sala inativa: ${room.name}`);
          rooms.delete(roomId);
          io.in(roomId).emit('room deleted', roomId);
          io.in(roomId).disconnectSockets(true);
        }
      }
    });

    // Emitir lista atualizada de salas após a limpeza
    io.emit('room list', {
      publicRooms: Array.from(rooms.values()).filter((room) => !room.isPrivate),
      privateRooms: Array.from(rooms.values()).filter((room) => room.isPrivate),
      publicLimit: +ROOM_PUBLIC_LIMIT,
      privateLimit: +ROOM_PRIVATE_LIMIT,
    });
  };

  // Agendar verificações periódicas
  setInterval(() => checkAndCleanRooms(false), CHECK_PUBLIC_ROOMS_INTERVAL);
  setInterval(() => checkAndCleanRooms(true), CHECK_PRIVATE_ROOMS_INTERVAL);
  //

  // random chat match
  function matchRandomUsers() {
    const queueArray = Array.from(randomQueue);
    const videoQueue = queueArray.filter((id) => videoEnabledUsers.has(id));
    const normalQueue = queueArray.filter((id) => !videoEnabledUsers.has(id));

    // Match video users with video users
    while (videoQueue.length >= 2) {
      const user1 = videoQueue.shift();
      const user2 = videoQueue.shift();
      if (user1 && user2) {
        matchUsers(user1, user2, true);
      }
    }

    // Match normal users
    while (normalQueue.length >= 2) {
      const user1 = normalQueue.shift();
      const user2 = normalQueue.shift();
      if (user1 && user2) {
        matchUsers(user1, user2, false);
      }
    }
  }

  // match users
  function matchUsers(user1, user2, withVideo) {
    // Verifica novamente se ambos ainda têm vídeo habilitado
    // const bothHaveVideo = withVideo &&
    // videoEnabledUsers.has(user1) &&
    // videoEnabledUsers.has(user2);

    randomQueue.delete(user1);
    randomQueue.delete(user2);
    activeRandomChats.set(user1, user2);
    activeRandomChats.set(user2, user1);

    io.to(user1).emit('chat matched', { partnerId: user2, withVideo });
    io.to(user2).emit('chat matched', { partnerId: user1, withVideo });
  }

  // handle random chat disconnect
  function handleRandomChatDisconnect(socketId) {
    const partnerId = activeRandomChats.get(socketId);
    if (partnerId) {
      io.to(partnerId).emit('partner left');
      activeRandomChats.delete(socketId);
      activeRandomChats.delete(partnerId);
    }
    randomQueue.delete(socketId);
  }
  //

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Pronto na http://${hostname}:${port}`);
  });
});
