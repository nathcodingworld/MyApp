import { Button, Card, CardActions, CardContent, CardMedia, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import KEY from "../../../Key/KEY";
import CheckboxInput from "../_Inputs/CheckBoxInput";
import PhotoFileInput from "../_Inputs/PhotoFileInput";
import TextInput from "../_Inputs/TextInput";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useSnackbar } from "notistack";
import { gql, useMutation } from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";
import { queryAction } from "../../../Providers/ReduxProvider";
import ShowError from "../../Component/ShowError";

type videoContent = {
  title: string;
  description: string;
  disableLike: boolean;
  disableComment: boolean;
  thumbnail: string;
};

type EditVideoCardType = {
  videoid: string;
  toEdit: videoContent;
  onDone: () => void;
};

const UpdateVideo = gql`
  mutation UpdateVideo($userid: String!, $videoid: String!, $title: String!, $thumbnail: String, $description: String, $disablelike: Boolean!, $disablecomment: Boolean!) {
    editvideo(userid: $userid, videoid: $videoid, title: $title, thumbnail: $thumbnail, description: $description, disablelike: $disablelike, disablecomment: $disablecomment) {
      message
    }
  }
`;

const EditVideoCard: React.FC<EditVideoCardType> = (props) => {
  const [isloading, setIsLoading] = useState(false);
  const [imgData, setImgData] = useState({ accepted: false, Msg: "", file: "" });
  const [title, setTitle] = useState({ accepted: false, Msg: "", value: "" });
  const [description, setDescription] = useState({ accepted: false, Msg: "", value: "" });
  const [disableLike, setDisableLike] = useState(false);
  const [disableComment, setDisableComment] = useState(false);
  const [editVideo, { loading, error }] = useMutation(UpdateVideo, { refetchQueries: ["GETVIDEO"] });
  const userid = useSelector<any, string>((state) => state.auth.ID);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  useEffect(() => {
    setImgData({
      accepted: true,
      Msg: "",
      file: props.toEdit.thumbnail,
    });
    setTitle({
      accepted: true,
      Msg: "",
      value: props.toEdit.title,
    });
    setDescription({
      accepted: true,
      Msg: "",
      value: props.toEdit.description,
    });
    setDisableLike(props.toEdit.disableLike);
    setDisableComment(props.toEdit.disableComment);
  }, []);

  async function onUpdateHandler() {
    if (!imgData.accepted) enqueueSnackbar(imgData.Msg, { variant: "error" });
    if (!title.accepted) enqueueSnackbar(`Title: ${title.Msg}`, { variant: "error" });
    if (!description.accepted) enqueueSnackbar(`Description: ${description.Msg}`, { variant: "error" });
    if (imgData.accepted && title.accepted && description.accepted) {
      try {
        const success = await editVideo({
          variables: { userid: userid, videoid: props.videoid, title: title.value, thumbnail: imgData.file, description: description.value, disablelike: disableLike, disablecomment: disableComment },
        });
        if (success.data) {
          enqueueSnackbar(success.data.editvideo.message, { variant: "success" });
          dispatch(queryAction.success());
          props.onDone();
        }
      } catch (error) {
        enqueueSnackbar("Post Unsuccessful", { variant: "error" });
        dispatch(queryAction.failed({ img: imgData.file, vdo: "", aud: "" }));
      }
    }
  }

  return (
    <Card>
      {imgData.file && <CardMedia component="img" height="194" src={`${KEY.PHOTOSERVER}/images/?image=${imgData.file}`} />}
      <CardContent>
        <PhotoFileInput setData={setImgData} name="Upload Thumbnail" imgFile={imgData.file} imgName={imgData.Msg} accepted={imgData.accepted} fullWidth={true} isLoading={setIsLoading} />
        <TextInput setData={setTitle} variant="standard" label="Title" type="text" accepted={title.accepted} multiline={false} value={title.value} />
        <TextInput setData={setDescription} value={description.value} accepted={description.accepted} multiline={true} type="text" variant={undefined} label="Description" />
        <CheckboxInput setDataFirst={setDisableLike} setDataSecond={setDisableComment} checkfirst={disableLike} checksecond={disableComment} labelfirst="Disalbe Like" labelsecond="Disable Comment" />
      </CardContent>
      <CardActions>
        {loading || isloading ? (
          <CircularProgress color="inherit" sx={{ margin: "auto" }} />
        ) : (
          <Button variant="contained" endIcon={<PlayArrowIcon />} sx={{ margin: "auto", width: "200px" }} onClick={onUpdateHandler} children={"UPDATE"} />
        )}
      </CardActions>
      {error && <ShowError error={error} />}
    </Card>
  );
};

export default EditVideoCard;
