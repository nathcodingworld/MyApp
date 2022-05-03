import { gql, useQuery } from "@apollo/client";
import { Grid, Stack } from "@mui/material";
import { useSelector } from "react-redux";
import ContentLoader from "../Component/ContentLoader";
import RoomList from "./Components/RoomList";
import { Socket } from "socket.io-client";
import ShowError from "../Component/ShowError";

type FriendRoomType = {
  socket: Socket;
};

const GetRooms = gql`
  query GetRooms($userid: String!) {
    getRooms(userid: $userid) {
      messageChatRoom {
        userid {
          avatar
          userName
        }
        roomid
      }
    }
  }
`;

const FriendRoom: React.FC<FriendRoomType> = (props) => {
  const userid = useSelector<any, string>((state) => state.auth.ID);
  const { loading, error, data } = useQuery(GetRooms, { variables: { userid } });
  if (loading) return <ContentLoader />;
  if (error) return <ShowError error={error} />;
  return (
    <Grid item xs={12} md={3} height="calc(100vh - 140px)">
      <Stack
        spacing={3}
        direction="column"
        width="100%"
        sx={{ overflowY: "scroll", "&::-webkit-scrollbar": { backgroundColor: (theme) => theme.palette.background.default, width: "8px" } }}
        maxHeight="calc(100vh - 140px)"
      >
        {data.getRooms.messageChatRoom.map((room: { userid: { avatar: string; userName: string }; roomid: string }) => {
          return <RoomList name={room.userid.userName} roomid={room.roomid} avatar={room.userid.avatar} socket={props.socket} />;
        })}
      </Stack>
    </Grid>
  );
};

export default FriendRoom;
