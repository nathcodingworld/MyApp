import { gql, useMutation, useQuery } from "@apollo/client";
import { Button, Card, CardActions, CardContent, CardMedia, CircularProgress, Divider, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";
import KEY from "../../../Key/KEY";
import { useDeleteAudioMutation } from "../../../Providers/APIs/AudioApi";
import { useDeleteImageMutation } from "../../../Providers/APIs/ImageApi";
import ContentLoader from "../../Component/ContentLoader";
import ShowError from "../../Component/ShowError";
import DisabledTextInput from "../_Inputs/DisabledTextInput";

type DeleteAudioCardType = {
  for: string;
  audioid: string;
};

const PreDeleteAudio = gql`
  query preDeleteAudio($id: String!) {
    getOneAudio(id: $id) {
      file
      cover
      title
      owner
      coverby
    }
  }
`;

const DeleteAudio = gql`
  mutation DeleteAudio($audioid: String!, $userid: String!, $cover: String, $file: String!) {
    deleteaudio(audioid: $audioid, userid: $userid, cover: $cover, file: $file) {
      message
    }
  }
`;

const DeleteAudioCard: React.FC<DeleteAudioCardType> = (props) => {
  const { loading, error, data } = useQuery(PreDeleteAudio, { variables: { id: props.audioid } });
  const [deleteAudioo, { loading: ld }] = useMutation(DeleteAudio, { refetchQueries: ["GETAUDIO"] });
  const [deleteImage] = useDeleteImageMutation();
  const [deleteAudio] = useDeleteAudioMutation();
  const userid = useSelector<any, string>((state) => state.auth.ID);
  const { enqueueSnackbar } = useSnackbar();

  async function onDeleteHandler() {
    try {
      const success = await deleteAudioo({ variables: { audioid: props.audioid, userid: userid, cover: data.getOneAudio.cover, file: data.getOneAudio.file } });
      if (success) {
        if (data.getOneAudio.cover) deleteImage(data.getOneAudio.cover);
        deleteAudio(data.getOneAudio.file);
        enqueueSnackbar(success.data.deleteaudio.message, { variant: "success" });
      }
    } catch (error: any) {
      enqueueSnackbar(error?.message, { variant: "error" });
    }
  }
  if (loading) return <ContentLoader />;
  if (error) return <ShowError error={error} />;

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" children={`Delete ${props.for}`} textAlign="center" />
        <Divider />
        {data.getOneAudio.cover && <CardMedia component="img" height="194" src={`${KEY.PHOTOSERVER}/images/?image=${data.getOneAudio.cover}`} />}
        <DisabledTextInput multiline={false} label="Title" value={`${data.getOneAudio.title} (cover by: ${data.getOneAudio.coverby})`} />
        <DisabledTextInput multiline={false} label="owner" value={data.getOneAudio.owner} />
      </CardContent>
      {ld ? <CircularProgress color="inherit" sx={{ margin: "auto" }} /> : <CardActions children={<Button sx={{ margin: "auto" }} onClick={onDeleteHandler} children="DELETE" />} />}
    </Card>
  );
};

export default DeleteAudioCard;
