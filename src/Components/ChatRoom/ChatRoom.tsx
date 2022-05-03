import { gql, useQuery } from "@apollo/client";
import { Grid, Stack } from "@mui/material";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import ContentLoader from "../Component/ContentLoader";
import AuthorMessage from "./Components/AuthorMessage";
import UserMessage from "./Components/UserMessage";
import Message from "./Components/Message";
import { Socket } from "socket.io-client";
import { queryAction } from "../../Providers/ReduxProvider";
import ShowError from "../Component/ShowError";

type ChatRoomType = {
  socket: Socket;
};

const GetRoom = gql`
  query GetRoom($roomid: String!) {
    getOneRoom(roomid: $roomid) {
      messages {
        userid {
          id
          avatar
        }
        message
      }
    }
  }
`;

const ChatRoom: React.FC<ChatRoomType> = (props) => {
  const running = useSelector<any, string>((state) => state.query.running);
  const roomid = useSelector<any, string>((state) => state.query.roomid);
  const userid = useSelector<any, string>((state) => state.auth.ID);
  const dispatch = useDispatch();
  const ChatRoom = useRef<any>();
  const { loading, error, data, refetch } = useQuery(GetRoom, { variables: { roomid } });
  useEffect(() => {
    if (roomid !== "none") props.socket.emit("joinRoom", roomid);
    if (!running) {
      props.socket.on("receiveMessage", async (args) => {
        await refetch();
        ChatRoom.current.scrollTop = ChatRoom.current.scrollHeight;
      });
      dispatch(queryAction.run());
    }
  }, [roomid]);
  if (loading) return <ContentLoader />;
  if (error) return <ShowError error={error} />;
  return (
    <Grid item xs={12} md={9} height="calc(100vh - 80px)" position="relative">
      <Stack
        id="ChatRoom"
        ref={ChatRoom}
        spacing={2}
        direction="column"
        width="100%"
        sx={{ overflowY: "scroll", "&::-webkit-scrollbar": { backgroundColor: (theme) => theme.palette.background.default, width: "12px" } }}
        height="calc(100vh - 160px)"
      >
        {data.getOneRoom.messages.map((msg: { userid: { id: string; avatar: string }; message: string }) => {
          if (msg.userid.id === userid) return <UserMessage message={msg.message} />;
          else return <AuthorMessage avatar={msg.userid.avatar} message={msg.message} />;
        })}
      </Stack>
      <Message roomid={roomid} socket={props.socket} refetch={refetch} reff={ChatRoom} />
    </Grid>
  );
};

export default ChatRoom;
