import { Modal, Box } from "@mui/material";
import AddAudioCard from "../Cards/AddCards/AddAudioCard";

import AddPhotoCard from "../Cards/AddCards/AddPhotoCart";
import AddPostCard from "../Cards/AddCards/AddPostCard";
import AddVideoCard from "../Cards/AddCards/AddVideoCard";
import AddUserCard from "../Cards/AddCards/AddUserCard";
import { useSelector } from "react-redux";
import ViewProfileCard from "../Cards/ViewCards/ViewProfileCard";

const style = {
  position: "absolute" as "absolute",
  top: "100px",
  left: "50%",
  transform: "translateX(-50%)",
  width: 400,
  border: "1.5px solid #fff",
  boxShadow: 24,
};

type propsType = { open: boolean; onClose: () => void; onNew: boolean; onLogin: () => void; onSignup: () => void };

const AddModal: React.FC<propsType> = (props) => {
  const page = useSelector<any>((state) => state.page.page);
  const isAuth = useSelector<any>((state) => state.auth.isAuth);

  return (
    <Modal open={props.open} onClose={props.onClose} sx={{ overflowY: "scroll", "&::-webkit-scrollbar": { display: "none" } }}>
      <Box sx={style}>
        {!isAuth && <AddUserCard onClose={props.onClose} onNew={props.onNew} onLogin={props.onLogin} onSignup={props.onSignup} />}
        {page === "PROFILE" && isAuth && <ViewProfileCard onClose={props.onClose} />}
        {page === "AUDIO" && isAuth && <AddAudioCard onClose={props.onClose} />}
        {page === "PHOTO" && isAuth && <AddPhotoCard onClose={props.onClose} />}
        {page === "VIDEO" && isAuth && <AddVideoCard onClose={props.onClose} />}
        {page === "POST" && isAuth && <AddPostCard onClose={props.onClose} />}
      </Box>
    </Modal>
  );
};

export default AddModal;
