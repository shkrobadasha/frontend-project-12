import { io } from 'socket.io-client';

let socket = null;

export const initSocket = () => {
    socket = io('http://0.0.0.0:3000');
    console.log("connecting socket...");
}

export const getSocket = () => {
  if (!socket) {
    console.error('Socket not initialized. Call initSocket() first.');
    return null;
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    console.log("disconnecting socket...");
    socket.disconnect();
  }
};