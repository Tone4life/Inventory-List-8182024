// utils/socket.js
import { Server } from 'socket.io';

let io;

export const initSocket = (server) => {
  io = new Server(server);
  return io;
};

export const getSocket = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};