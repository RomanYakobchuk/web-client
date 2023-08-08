import {io} from "socket.io-client";

export const socket = io(
    // `wss://capl-test-97d791c8c43f.herokuapp.com`
    `${process.env.REACT_APP_SOCKET_API}`
)


