import { Avatar, Button, Typography } from "@mui/material";
import { Theme } from "@mui/system";
import { useDispatch, useSelector } from "react-redux";
import KEY from "../../../Key/KEY";
import { queryAction } from "../../../Providers/ReduxProvider";
import { Socket } from "socket.io-client";

type RoomListType = {
  avatar: string;
  name: string;
  roomid: string;
  socket: Socket;
};
const style = { color: (theme: Theme) => theme.palette.text.primary, display: "flex", flexDirection: "row", paddingLeft: "8px", justifyContent: "flex-start" };

const RoomList: React.FC<RoomListType> = (props) => {
  const roomid = useSelector<any, string>((state) => state.query.roomid);
  const dispatch = useDispatch();
  function onJoinRoomHandler() {
    if (roomid !== props.roomid && roomid !== "none") props.socket.emit("leaveRoom", roomid);
    dispatch(queryAction.connect(props.roomid));
  }
  return (
    <Button sx={style} onClick={onJoinRoomHandler}>
      <Avatar alt="USer" src={`${KEY.PHOTOSERVER}/images/?image=${props.avatar}`} />
      <Typography variant="h6" children={props.name} paddingLeft={3} />
    </Button>
  );
};

export default RoomList;
