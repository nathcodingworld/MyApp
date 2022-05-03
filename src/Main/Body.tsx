import { Box } from "@mui/material";
import ContentWraper from "../Components/Layout/ContentWraper";
import Sidebar from "../Components/Layout/Sidebar";
import { io } from "socket.io-client";
import KEY from "../Key/KEY";

const socket = io(`${KEY.MAINSERVER}`);
type proptype = {
  open: boolean;
  onToggle: (state: boolean) => () => void;
};
const Body: React.FC<proptype> = (prop) => {
  return (
    <Box>
      <Sidebar socket={socket} open={prop.open} onToggle={prop.onToggle}></Sidebar>
      <ContentWraper socket={socket}></ContentWraper>
    </Box>
  );
};

export default Body;
