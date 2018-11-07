const connection = {
  socket: null,
  connectToServerSocket(state) {
    const { SERVER_INIT_CLIENT } = sharedSocketConfig;

    return new Promise(resolve => {
      const socket = io();

      socket.on(SERVER_INIT_CLIENT, msg => {
        console.log(msg);
        resolve();
      });

      this.socket = socket;
    });
  },
};
