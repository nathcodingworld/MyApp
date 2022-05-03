import { Avatar, Card, CardHeader, Divider, Grid } from "@mui/material";
import CardHoverMedia from "../Component/CardHoverMedia";
import KEY from "../../Key/KEY";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { mediaDataAction, modalAction } from "../../Providers/ReduxProvider";
import More from "../Component/More";
import { useState } from "react";
import EditModal from "../Modal/EditModal";
import DeleteModal from "../Modal/DeleteModal";
import { Theme } from "@mui/system";

const vcStyle = {
  p: 1,
};

const videoCardStyle = {
  backgroundColor: "transparent",
  position: "relative",
  "&:hover": {
    transform: (theme: Theme) => (theme.breakpoints.down("sm") ? "scale(1)" : "scale(1.5)"),
    transition: "transform 400ms ease-in-out 500ms",
    zIndex: 10,
  },
};

export type vType = {
  userid: {
    id: string;
    userName: string;
    avatar: string;
  };
  id: string;
  file: string;
  thumbnail: string;
  title: string;
  disablelike: boolean;
  disablecomment: boolean;
  description: string;
  view: number;
  like: number;
};

const VideoCard: React.FC<vType> = (props) => {
  const userid = useSelector<any, string>((state) => state.auth.ID);
  const isAuth = useSelector<any, boolean>((state) => state.auth.isAuth);
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function onOpenVideoPlayerHandler(e: any) {
    dispatch(
      mediaDataAction.setVideoData({ id: props.id, desc: `${props.userid.userName}  ${props.view}views  ${props.like}Like`, title: props.title, video: props.file, time: 0, play: true, mute: false })
    );
    dispatch(modalAction.closeView());
    navigate("/VideoOne");
  }

  return (
    <Grid item lg={3} md={4} sm={6} xs={12}>
      <Card sx={videoCardStyle} id={props.id} onClick={onOpenVideoPlayerHandler}>
        <CardHoverMedia thumbnail={props.thumbnail} file={props.file} width="100%" />
        <Divider />
        <CardHeader
          sx={vcStyle}
          avatar={<Avatar alt="user" src={`${KEY.PHOTOSERVER}/images/?image=${props.userid.avatar}`} />}
          title={props.title}
          subheader={`${props.userid.userName}  ${props.view}views  ${props.like}Like`}
          action={<More onDeleting={setDeleting} onEditing={setEditing} for="Video" authorize={isAuth && props.userid.id === userid} sx={{ position: "absolute", right: "-15px", bottom: "15px" }} />}
        />
      </Card>
      <EditModal
        onClose={setEditing}
        open={editing}
        page="Video"
        content={{ title: props.title, description: props.description, thumbnail: props.thumbnail, disableLike: props.disablelike, disableComment: props.disablecomment }}
        id={props.id}
      />
      <DeleteModal onClose={setDeleting} open={deleting} onDelete={undefined} page="Video" idToDelete={props.id} />
    </Grid>
  );
};

export default VideoCard;
