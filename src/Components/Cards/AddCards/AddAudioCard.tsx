import { Button, Card, CardActions, CardContent, CardHeader, CardMedia, CircularProgress, Divider, IconButton } from "@mui/material";
import UserAvatar from "../../UI/UserAvatar";
import SendIcon from "@mui/icons-material/Send";

import { useState } from "react";
import KEY from "../../../Key/KEY";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { gql, useMutation } from "@apollo/client";
import { queryAction } from "../../../Providers/ReduxProvider";
import AudioFileInput from "../_Inputs/AudioFileInput";
import PhotoFileInput from "../_Inputs/PhotoFileInput";
import TextInput from "../_Inputs/TextInput";
import ShowError from "../../Component/ShowError";

type AddAudioCardType = {
  onClose: () => void;
};

const Audio = gql`
  mutation Audio($userid: String!, $title: String!, $cover: String, $file: String!, $owner: String!, $coverby: String) {
    audio(userid: $userid, title: $title, cover: $cover, file: $file, owner: $owner, coverby: $coverby) {
      message
    }
  }
`;

const AddAudioCard: React.FC<AddAudioCardType> = (Props) => {
  const [isloading, setIsLoading] = useState(false);
  const [imgData, setImgData] = useState({ accepted: false, Msg: "", file: "" });
  const [audData, setAudData] = useState({ accepted: false, Msg: "", file: "" });
  const [title, setTitle] = useState({ accepted: false, Msg: "", value: "" });
  const [owner, setOwner] = useState({ accepted: false, Msg: "", value: "" });
  const [coverBy, setCoverBy] = useState({ accepted: false, Msg: "", value: "" });
  const [audio, { loading, error }] = useMutation(Audio, { refetchQueries: ["GETAUDIO"] });
  const username = useSelector<any, string>((state) => state.auth.userName);
  const id = useSelector<any, string>((state) => state.auth.ID);
  const userpic = useSelector<any, string>((state) => state.auth.propic);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  async function onSubmitHandler() {
    if (!title.accepted) enqueueSnackbar(`Title: ${title.Msg}`, { variant: "error" });
    if (!owner.accepted) enqueueSnackbar(`Owner: ${owner.Msg}`, { variant: "error" });
    if (!coverBy.accepted) enqueueSnackbar(`CoverBy: ${coverBy.Msg}`, { variant: "error" });
    if (!imgData.accepted) enqueueSnackbar(`Cover Photo: ${imgData.Msg}`, { variant: "error" });
    if (!audData.accepted) enqueueSnackbar(`AudioFile: ${audData.Msg}`, { variant: "error" });
    if (title.accepted && owner.accepted && coverBy.accepted && imgData.accepted && audData.accepted) {
      try {
        const success = await audio({
          variables: {
            name: username,
            userid: id,
            propic: userpic,
            title: title.value,
            owner: owner.value,
            coverby: coverBy.value,
            cover: imgData.file,
            file: audData.file,
          },
        });
        if (success) {
          enqueueSnackbar(success.data.audio.message, { variant: "success" });
          dispatch(queryAction.success());
          Props.onClose();
        }
      } catch (error) {
        enqueueSnackbar("Post Unsuccessful", { variant: "error" });
        dispatch(queryAction.failed({ img: imgData.file, vdo: "", aud: audData.file }));
      }
    }
  }

  return (
    <Card>
      <CardHeader avatar={<UserAvatar />} title={username} subheader={new Date().toDateString()} action={!isloading && <IconButton children={<SendIcon />} onClick={onSubmitHandler} />} />
      <Divider />
      {imgData.file && <CardMedia component="img" height="200" width="200" src={`${KEY.PHOTOSERVER}/images/?image=${imgData.file}`} />}
      <CardContent>
        <PhotoFileInput setData={setImgData} imgFile={imgData.file} imgName={imgData.Msg} accepted={imgData.accepted} name="Cover" fullWidth={true} isLoading={setIsLoading} />
        <AudioFileInput setData={setAudData} audFile={audData.file} audMsg={audData.Msg} isLoading={setIsLoading} />
        <TextInput setData={setTitle} label="Title" variant="standard" type="text" accepted={title.accepted} multiline={false} value={title.value} />
        <TextInput setData={setOwner} label="Owner" variant="standard" type="text" accepted={owner.accepted} multiline={false} value={owner.value} />
        <TextInput setData={setCoverBy} label="Cover By" variant="standard" type="text" accepted={coverBy.accepted} multiline={false} value={coverBy.value} />
      </CardContent>
      <CardActions>
        {loading || isloading ? (
          <CircularProgress color="inherit" sx={{ margin: "auto" }} />
        ) : error ? (
          <ShowError error={error} />
        ) : (
          <Button variant="contained" endIcon={<SendIcon />} sx={{ margin: "auto", width: "200px" }} onClick={onSubmitHandler} children="Post" />
        )}
      </CardActions>
    </Card>
  );
};

export default AddAudioCard;
