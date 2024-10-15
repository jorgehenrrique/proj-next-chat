import { io } from 'socket.io-client';

export const initSocket = () => {
  const socket = io();
  return socket;
};
