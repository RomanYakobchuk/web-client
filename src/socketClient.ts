import {io} from "socket.io-client";

export const socket = io(
    // `wss://capl-test-97d791c8c43f.herokuapp.com`
    `${import.meta.env.VITE_APP_SOCKET_API}`
)


