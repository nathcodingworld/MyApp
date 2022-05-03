import { Box, Modal } from "@mui/material";
import AcceptFriend from "../Cards/ConfirmCards/AcceptFriend";
import AddFriend from "../Cards/ConfirmCards/AddFriend";
import CancelFriend from "../Cards/ConfirmCards/CancelFriend";
import DeleteFriend from "../Cards/ConfirmCards/DeleteFriend";
import RefuseFriend from "../Cards/ConfirmCards/RefuseFriend";

type ConfirmModalType = {
  open: boolean;
  onClose: (args: { request: string; open: boolean }) => void;
  to: string;
  userid: string;
};

const style = {
  position: "absolute" as "absolute",
  top: "100px",
  left: "50%",
  transform: "translateX(-50%)",
  width: 400,
  bgcolor: "#181818",
  border: "1.5px solid #fff",
  boxShadow: 24,
  p: 1,
};

const ConfirmModal: React.FC<ConfirmModalType> = (props) => {
  function onCloseHandler() {
    props.onClose({ request: "", open: false });
  }
  return (
    <Modal open={props.open} onClose={onCloseHandler} sx={{ overflowY: "scroll" }}>
      <Box sx={style}>
        {props.to === "Accept friend request" && <AcceptFriend userid={props.userid} onDone={onCloseHandler} />}
        {props.to === "Refuse friend request" && <RefuseFriend userid={props.userid} onDone={onCloseHandler} />}
        {props.to === "Cancel friend request" && <CancelFriend userid={props.userid} onDone={onCloseHandler} />}
        {props.to === "Remove friend" && <DeleteFriend userid={props.userid} onDone={onCloseHandler} />}
        {props.to === "Add friend" && <AddFriend userid={props.userid} onDone={onCloseHandler} />}
      </Box>
    </Modal>
  );
};

export default ConfirmModal;
