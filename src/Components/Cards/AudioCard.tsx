import { Avatar, Card, CardHeader, CardMedia, Grid } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import KEY from "../../Key/KEY";
import { mediaDataAction, modalAction } from "../../Providers/ReduxProvider";
import More from "../Component/More";
import DeleteModal from "../Modal/DeleteModal";
import EditModal from "../Modal/EditModal";

type AudioCardType = {
  userid: {
    id: string;
    avatar: string;
  };
  id: string;
  title: string;
  owner: string;
  cover: string;
  file: string;
  coverby: string;
};

const AudioCard: React.FC<AudioCardType> = (props) => {
  const userid = useSelector<any, string>((state) => state.auth.ID);
  const isAuth = useSelector<any, boolean>((state) => state.auth.isAuth);
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);
  const dispatch = useDispatch();
  function setPlayHandler() {
    dispatch(mediaDataAction.setAudioData({ file: props.file, cover: props.cover, title: props.title, owner: props.owner }));
    dispatch(modalAction.openAudioPlayer());
  }

  return (
    <Grid item lg={2} md={3} sm={4} xs={6}>
      <Card onClick={setPlayHandler} id={props.id} sx={{ position: "relative" }}>
        <CardMedia component="img" height="150px" width="150px" src={`${KEY.PHOTOSERVER}/images/?image=${props.cover}`} />
        <CardHeader
          avatar={<Avatar alt="user" src={`${KEY.PHOTOSERVER}/images/?image=${props.userid.avatar}`} />}
          title={props.title}
          subheader={props.owner}
          action={<More onDeleting={setDeleting} onEditing={setEditing} for="Audio" authorize={isAuth && props.userid.id === userid} sx={{ position: "absolute", right: "-15px", top: "63%" }} />}
        />
      </Card>
      <EditModal onClose={setEditing} open={editing} page="Audio" id={props.id} content={{ title: props.title, cover: props.cover, owner: props.owner, coverby: props.coverby }} />
      <DeleteModal onClose={setDeleting} open={deleting} onDelete={undefined} page="Audio" idToDelete={props.id} />
    </Grid>
  );
};

export default AudioCard;
