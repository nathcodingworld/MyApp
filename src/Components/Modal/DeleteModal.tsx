import { Box, Modal } from "@mui/material";
import DeleteAudioCard from "../Cards/DeleteCards/DeleteAudioCard";
import DeletePhotoCard from "../Cards/DeleteCards/DeletePhotoCard";
import DeletePostCard from "../Cards/DeleteCards/DeletePostCard";
import DeleteUserCard from "../Cards/DeleteCards/DeleteUserCard";
import DeleteVideoCard from "../Cards/DeleteCards/DeleteVideoCard";

type DeleteModalType = {
  open: boolean;
  onClose: (state: boolean) => void;
  page: string;
  onDelete: (() => void) | undefined;
  idToDelete: string;
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

const DeleteModal: React.FC<DeleteModalType> = (props) => {
  function onCloseHandler() {
    props.onClose(false);
  }
  return (
    <Modal open={props.open} onClose={onCloseHandler} sx={{ overflowY: "scroll" }}>
      <Box sx={style}>
        {props.page === "Account" && <DeleteUserCard for={props.page} onDelete={props.onDelete!} />}
        {props.page === "Post" && <DeletePostCard for={props.page} postid={props.idToDelete} />}
        {props.page === "Photo" && <DeletePhotoCard for={props.page} onDelete={props.onDelete!} photoid={props.idToDelete} />}
        {props.page === "Video" && <DeleteVideoCard for={props.page} videoid={props.idToDelete} />}
        {props.page === "Audio" && <DeleteAudioCard for={props.page} audioid={props.idToDelete} />}
      </Box>
    </Modal>
  );
};

export default DeleteModal;
