import { Box, Modal } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useDeleteImageMutation } from "../../Providers/APIs/ImageApi";
import { queryAction } from "../../Providers/ReduxProvider";
import EditAudioCard from "../Cards/EditCards/EditAudioCard";
import EditPhotoCard from "../Cards/EditCards/EditPhotoCard";
import EditPostCard from "../Cards/EditCards/EditPostCard";
import EditProfileCard from "../Cards/EditCards/EditProfileCard";
import EditVideoCard from "../Cards/EditCards/EditVideoCard";

type EditModalType = {
  open: boolean;
  onClose: (state: boolean) => void;
  page: string;
  id: string;
  content: any;
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

const EditModal: React.FC<EditModalType> = (props) => {
  const [deleteImage] = useDeleteImageMutation();
  const error = useSelector<any, boolean>((state) => state.query.error);
  const imgfile = useSelector<any, string>((state) => state.query.imgfile);
  const dispatch = useDispatch();

  function onCloseHandler() {
    props.onClose(!props.open);
    if (error) {
      if (imgfile) deleteImage(imgfile);
      dispatch(queryAction.success());
    }
  }

  return (
    <Modal open={props.open} onClose={onCloseHandler} sx={{ overflowY: "scroll" }}>
      <Box sx={style}>
        {props.page === "Account" && <EditProfileCard onClose={onCloseHandler} />}
        {props.page === "Post" && <EditPostCard postid={props.id} toEdit={props.content} onDone={onCloseHandler} />}
        {props.page === "Photo" && <EditPhotoCard photoid={props.id} toEdit={props.content} onDone={onCloseHandler} />}
        {props.page === "Video" && <EditVideoCard videoid={props.id} toEdit={props.content} onDone={onCloseHandler} />}
        {props.page === "Audio" && <EditAudioCard audioid={props.id} toEdit={props.content} onDone={onCloseHandler} />}
      </Box>
    </Modal>
  );
};

export default EditModal;
