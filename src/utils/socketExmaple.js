import {SocketWrap} from "@/utils/socketWrapper";
const socket = new SocketWrap(true);
let connectedEvent = null;
socket.connect("ws://localhost:8080/ws");

if (connectedEvent != null)
    socket.removeListener('connected', connectedEvent)
connectedEvent = socket.on("connected", ()=>{
    socket.send({
        "type": "login",
        "data":{
            "token": '123',
        }
    });
})

// TODO : handle poker_status event
let statusEventKey = socket.on("poker_status", (data)=>{
    console.log(data);
})
