import { Box, Modal } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { modalAction } from "../../Providers/ReduxProvider";

import ViewPhotoCaptionCard from "../Cards/ViewCards/ViewPhotoCaptionCard";
import ViewPhotoCard from "../Cards/ViewCards/ViewPhotoCard";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  height: { md: "calc(100% - 80px)" },
  width: { sm: "calc(100% - 100px)", xs: "100%" },
  maxHeight: "calc(100% - 70px)",
  maxWidth: "1400px",
  bgcolor: "#181818",
  display: "flex",
  flexDirection: { md: "row", xs: "column" },
  justifyContent: { md: "space-between" },
};

const sample = {
  name: "nahtaniel",
  date: "jan 10 2020",
  comment: 12,
  like: 122,
  caption: "some verrrrrrrrrrry longgggggggggggggggg Captttttttttttttionnnnnnnnnn asd adasdasda asdaksdj  alkjsda laskdh",
  comments: [
    { id: "1", name: "stever", date: "feb 20 2020", comment: "some very long Commmentssst asdasd" },
    { id: "1", name: "stever", date: "feb 20 2020", comment: "some very long Commmentssst asdasd" },
    { id: "1", name: "stever", date: "feb 20 2020", comment: "some very long Commmentssst asdasd" },
    { id: "1", name: "stever", date: "feb 20 2020", comment: "some very long Commmentssst asdasd" },
    { id: "1", name: "stever", date: "feb 20 2020", comment: "some very long Commmentssst asdasd" },
  ],
};

const ViewModal: React.FC = (props) => {
  const open = useSelector<any, boolean>((state) => state.modal.openView);
  const dispatch = useDispatch();
  function onCloseHandler() {
    dispatch(modalAction.ToggleViewtModal());
  }
  return (
    <Modal open={open} onClose={onCloseHandler}>
      <Box sx={style}>
        <ViewPhotoCard />
        <ViewPhotoCaptionCard onClose={onCloseHandler} />
      </Box>
    </Modal>
  );
};

export default ViewModal;
