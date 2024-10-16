import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server } from 'socket.io';
import { instrument } from '@socket.io/admin-ui';
import dotenv from 'dotenv';
import { generateHash } from './scripts/generate-hash.js';

dotenv.config();

const rooms = new Set(['global']);

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
    socket.on('get rooms', () => {
      socket.emit('room list', {
        rooms: Array.from(rooms),
        limit: parseInt(ROOM_LIMIT, 10),
      });
    });

    // create room
    socket.on('create room', (roomName) => {
      if (!rooms.has(roomName) && rooms.size < parseInt(ROOM_LIMIT, 10)) {
        rooms.add(roomName);
        // io.emit('room list', Array.from(rooms));
        io.emit('room list', {
          rooms: Array.from(rooms),
          limit: parseInt(ROOM_LIMIT, 10),
        });
        socket.emit('room created', roomName);
      } else if (rooms.has(roomName)) {
        socket.emit('room exists', roomName);
      } else {
        socket.emit('room limit reached');
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
