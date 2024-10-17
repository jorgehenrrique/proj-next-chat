import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server } from 'socket.io';
import { instrument } from '@socket.io/admin-ui';
import dotenv from 'dotenv';
import { generateHash } from './scripts/generate-hash.js';
import { v4 as uuid } from 'uuid';

dotenv.config();

// const rooms = new Set(['global']);
const rooms = new Map();
const globalRoom = { id: 'global', name: 'global', isPrivate: false };
rooms.set(globalRoom.id, globalRoom);

const { HOSTNAME, PORT, ADMIN_USERNAME, ROOM_LIMIT } = process.env;

const dev = process.env.NODE_ENV !== 'production';
const hostname = HOSTNAME;
const port = PORT;
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(async () => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
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
    console.log('Um cliente se conectou');

    // socket.on('message', (msg) => {
    //   io.emit('message', msg);
    // });

    // get rooms
    // socket.on('get rooms', () => {
    //   socket.emit('room list', {
    //     rooms: Array.from(rooms),
    //     limit: parseInt(ROOM_LIMIT, 10),
    //   });
    // });
    socket.on('get rooms', () => {
      const publicRooms = Array.from(rooms.values()).filter(
        (room) => !room.isPrivate
      );
      socket.emit('room list', {
        rooms: publicRooms,
        limit: parseInt(ROOM_LIMIT, 10),
      });
    });

    // create room
    // socket.on('create room', (roomName) => {
    //   if (!rooms.has(roomName) && rooms.size < parseInt(ROOM_LIMIT, 10)) {
    //     rooms.add(roomName);
    //     // io.emit('room list', Array.from(rooms));
    //     io.emit('room list', {
    //       rooms: Array.from(rooms),
    //       limit: parseInt(ROOM_LIMIT, 10),
    //     });
    //     socket.emit('room created', roomName);
    //   } else if (rooms.has(roomName)) {
    //     socket.emit('room exists', roomName);
    //   } else {
    //     socket.emit('room limit reached');
    //   }
    // });
    socket.on('create room', ({ name, isPrivate, password }) => {
      const roomNameExists = Array.from(rooms.values()).some(
        (room) => room.name === name && !room.isPrivate
      );
      if (!roomNameExists && rooms.size < parseInt(ROOM_LIMIT, 10)) {
        const roomId = uuid();
        const newRoom = { id: roomId, name, isPrivate, password };
        rooms.set(roomId, newRoom);
        io.emit('room list', {
          rooms: Array.from(rooms.values()).filter((room) => !room.isPrivate),
          limit: parseInt(ROOM_LIMIT, 10),
        });
        socket.emit('room created', { id: roomId, name, isPrivate });
      } else if (roomNameExists) {
        socket.emit('room exists', name);
      } else {
        socket.emit('room limit reached');
      }
    });

    // obter informações de uma sala específica
    socket.on('get room', (roomId) => {
      const room = rooms.get(roomId);
      if (room) {
        socket.emit('room info', {
          id: room.id,
          name: room.name,
          isPrivate: room.isPrivate,
        });
      } else {
        socket.emit('room info', null);
      }
    });

    // entrar em uma sala privada
    socket.on('join private room', ({ roomId, password }) => {
      const room = rooms.get(roomId);
      if (room && room.isPrivate && room.password === password) {
        socket.join(roomId);
        socket.emit('join result', true);
      } else {
        socket.emit('join result', false);
      }
    });

    // join room
    socket.on('join room', (roomId) => {
      socket.join(roomId);
      console.log(`Cliente entrou na sala ${roomId}`);
    });

    // leave room
    socket.on('leave room', (roomId) => {
      socket.leave(roomId);
      console.log(`Cliente saiu da sala ${roomId}`);
    });

    // message
    socket.on('message', (msg) => {
      io.to(msg.roomId).emit('message', msg);
    });

    // disconnect
    socket.on('disconnect', () => {
      console.log('Um cliente se desconectou');
    });
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Pronto na http://${hostname}:${port}`);
  });
});
