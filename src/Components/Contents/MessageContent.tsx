import { Socket } from "socket.io-client";
import ChatRoom from "../ChatRoom/ChatRoom";
import FriendRoom from "../ChatRoom/FriendRooms";

type MessageContentType = {
  socket: Socket;
};

const MessageContent: React.FC<MessageContentType> = (props) => {
  return (
    <>
      <ChatRoom socket={props.socket} />
      <FriendRoom socket={props.socket} />
    </>
  );
};

export default MessageContent;
