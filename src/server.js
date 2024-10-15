import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

dotenv.config();

const { HOSTNAME, PORT } = process.env;

const dev = process.env.NODE_ENV !== 'production';
const hostname = HOSTNAME;
const port = PORT;
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(server);

  io.on('connection', (socket) => {
    console.log('Um cliente se conectou');

    socket.on('message', (msg) => {
      io.emit('message', msg);
    });

    socket.on('disconnect', () => {
      console.log('Um cliente se desconectou');
    });
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Pronto na http://${hostname}:${port}`);
  });
});
