import { Button, Card, CardActions, CardContent, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import CheckboxInput from "../_Inputs/CheckBoxInput";
import TextInput from "../_Inputs/TextInput";
import SendIcon from "@mui/icons-material/Send";
import { gql, useMutation } from "@apollo/client";
import { useSnackbar } from "notistack";
import ShowError from "../../Component/ShowError";

type photoContent = {
  photoCaption: string;
  photoDisableLike: boolean;
  photoDisableComment: boolean;
};

type EditPhotoCardType = {
  photoid: string;
  toEdit: photoContent;
  onDone: () => void;
};

const UpdatePhoto = gql`
  mutation UpdatePhoto($photoid: String!, $caption: String, $disablelike: Boolean!, $disablecomment: Boolean!) {
    editphoto(photoid: $photoid, caption: $caption, disablelike: $disablelike, disablecomment: $disablecomment) {
      message
    }
  }
`;

const EditPhotoCard: React.FC<EditPhotoCardType> = (props) => {
  const [Caption, setCaption] = useState({ accepted: false, Msg: "", value: "" });
  const [disableLike, setDisableLike] = useState(false);
  const [disableComment, setDisableComment] = useState(false);
  const [editPhoto, { loading, error }] = useMutation(UpdatePhoto, { refetchQueries: ["GETONEPHOTO"] });
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setCaption({
      accepted: true,
      Msg: "",
      value: props.toEdit.photoCaption,
    });
    setDisableLike(props.toEdit.photoDisableLike);
    setDisableComment(props.toEdit.photoDisableComment);
  }, []);

  async function onUpdateHandler() {
    if (!Caption.accepted) enqueueSnackbar(`Image File: ${Caption.Msg}`, { variant: "error" });
    else {
      try {
        const success = await editPhoto({ variables: { photoid: props.photoid, caption: Caption.value, disablelike: disableLike, disablecomment: disableComment } });
        if (success.data.editphoto.message === "edit Photo Successful") {
          enqueueSnackbar(success.data.editphoto.message, { variant: "success" });
          props.onDone();
        }
      } catch (error: any) {
        enqueueSnackbar(error?.message, { variant: "error" });
      }
    }
  }

  return (
    <Card>
      <CardContent>
        <TextInput setData={setCaption} value={Caption.value} accepted={Caption.accepted} multiline={true} type="text" variant={undefined} label="Caption" />
        <CheckboxInput setDataFirst={setDisableLike} setDataSecond={setDisableComment} checkfirst={disableLike} checksecond={disableComment} labelfirst="Disalbe Like" labelsecond="Disable Comment" />
      </CardContent>
      <CardActions>
        {loading ? (
          <CircularProgress color="inherit" sx={{ margin: "auto" }} />
        ) : (
          <Button variant="contained" endIcon={<SendIcon />} sx={{ margin: "auto", width: "200px" }} onClick={onUpdateHandler} children={"UPDATE"} />
        )}
      </CardActions>
      {error && <ShowError error={error} />}
    </Card>
  );
};

export default EditPhotoCard;
