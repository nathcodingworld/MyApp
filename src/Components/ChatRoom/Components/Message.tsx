import { Button, Stack } from "@mui/material";

import { useSnackbar } from "notistack";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Socket } from "socket.io-client";
import MessageInput from "../../Cards/_Inputs/MessageInput";

type MessageType = {
  roomid: string;
  socket: Socket;
  reff: any;
  refetch: () => Promise<any>;
};

const Message: React.FC<MessageType> = (props) => {
  const userid = useSelector<any, string>((state) => state.auth.ID);
  const [messageData, setMessageData] = useState({ accepted: false, Msg: "", value: "" });
  const { enqueueSnackbar } = useSnackbar();
  async function onSendHandler() {
    if (!messageData.accepted) enqueueSnackbar(messageData.Msg, { variant: "error" });
    else {
      try {
        if (!userid) {
          enqueueSnackbar("not Log in", { variant: "error" });
          return;
        }
        if (props.roomid === "none") {
          enqueueSnackbar("There is no friend to send message, find friend in profile page", { variant: "info" });
          return;
        }
        props.socket.emit("sendMessage", { roomid: props.roomid, userid, message: messageData.value });
        setMessageData({ accepted: false, Msg: "", value: "" });
        await props.refetch();
        props.reff.current.scrollTop = props.reff.current.scrollHeight;
      } catch (error: any) {
        enqueueSnackbar(error?.message, { variant: "error" });
      }
    }
  }

  return (
    <Stack direction="row" position="absolute" bottom="0" spacing={1} width="100%">
      <MessageInput setData={setMessageData} value={messageData.value} accepted={messageData.accepted} />
      <Button children="SEND" onClick={onSendHandler} />
    </Stack>
  );
};

export default Message;
