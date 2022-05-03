import { gql, useMutation, useQuery } from "@apollo/client";
import { Button, Card, CardActions, CardContent, CardMedia, CircularProgress, Divider, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";
import KEY from "../../../Key/KEY";
import { useDeleteImageMutation } from "../../../Providers/APIs/ImageApi";
import { useDeleteVideoMutation } from "../../../Providers/APIs/VideoApi";
import ContentLoader from "../../Component/ContentLoader";
import ShowError from "../../Component/ShowError";
import DisableExpresion from "../_Inputs/DisabledExpresion";
import DisabledTextInput from "../_Inputs/DisabledTextInput";

type DeleteVideoCardType = {
  for: string;
  videoid: string;
};

const PreDeleteVideo = gql`
  query PreDeleteVideo($id: String!) {
    getOneVideo(id: $id) {
      file
      thumbnail
      title
      description
      comment
      like
    }
  }
`;

const DeleteVideo = gql`
  mutation DeleteVideo($videoid: String!, $userid: String!, $thumbnail: String, $file: String!) {
    deletevideo(videoid: $videoid, userid: $userid, thumbnail: $thumbnail, file: $file) {
      message
    }
  }
`;

const DeleteVideoCard: React.FC<DeleteVideoCardType> = (props) => {
  const { loading, error, data } = useQuery(PreDeleteVideo, { variables: { id: props.videoid } });
  const [deleteVideoo, { loading: ld }] = useMutation(DeleteVideo, { refetchQueries: ["GETVIDEO"] });
  const [deleteImage] = useDeleteImageMutation();
  const [deleteVideo] = useDeleteVideoMutation();
  const userid = useSelector<any, string>((state) => state.auth.ID);
  const { enqueueSnackbar } = useSnackbar();

  async function onDeleteHandler() {
    try {
      const success = await deleteVideoo({ variables: { videoid: props.videoid, userid: userid, thumbnail: data.getOneVideo.thumbnail, file: data.getOneVideo.file } });
      if (success.data.deletevideo.message === "delete Video Successful") {
        if (data.getOneVideo.thumbnail) deleteImage(data.getOneVideo.thumbnail);
        deleteVideo(data.getOneVideo.file);
        enqueueSnackbar(success.data.deletevideo.message, { variant: "success" });
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
        {data.getOneVideo.thumbnail && <CardMedia component="img" height="194" src={`${KEY.PHOTOSERVER}/images/?image=${data.getOneVideo.thumbnail}`} />}
        <DisabledTextInput multiline={false} label="Title" value={data.getOneVideo.title} />
        <DisabledTextInput multiline={true} label="Description" value={data.getOneVideo.description} />
        <DisableExpresion A={data.getOneVideo.like} B={data.getOneVideo.comment} Aicon="thumbup" Bicon="comments" />
      </CardContent>
      {ld ? <CircularProgress color="inherit" sx={{ margin: "auto" }} /> : <CardActions children={<Button sx={{ margin: "auto" }} onClick={onDeleteHandler} children="DELETE" />} />}
    </Card>
  );
};

export default DeleteVideoCard;
