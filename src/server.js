import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server } from 'socket.io';
import { instrument } from '@socket.io/admin-ui';
import dotenv from 'dotenv';
import { generateHash } from './scripts/generate-hash.js';
import { v4 as uuid } from 'uuid';
import bcrypt from 'bcrypt';

dotenv.config();

const rooms = new Map();
const globalRoom = { id: 'global', name: 'global', isPrivate: false };
rooms.set(globalRoom.id, globalRoom);

const {
  HOSTNAME,
  PORT,
  ADMIN_USERNAME,
  ROOM_PUBLIC_LIMIT,
  ROOM_PRIVATE_LIMIT,
} = process.env;

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
      // console.log(rooms);
    });

    socket.on('create room', async ({ name, isPrivate, password }) => {
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
    socket.on('join private room', async ({ roomId, password }) => {
      const room = rooms.get(roomId);
      if (
        room &&
        room.isPrivate &&
        (await bcrypt.compare(password, room.password))
      ) {
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
