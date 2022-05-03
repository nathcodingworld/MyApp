import { gql, useMutation, useQuery } from "@apollo/client";
import { Button, Card, CardActions, CardContent, CardMedia, CircularProgress, Divider, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";
import KEY from "../../../Key/KEY";
import { useDeleteImageMutation } from "../../../Providers/APIs/ImageApi";
import ContentLoader from "../../Component/ContentLoader";
import ShowError from "../../Component/ShowError";
import DisableExpresion from "../_Inputs/DisabledExpresion";
import DisabledTextInput from "../_Inputs/DisabledTextInput";

type DeletePhotoCardType = {
  for: string;
  photoid: string;
  onDelete: () => void;
};

const preDeletePhoto = gql`
  query preDeletePhoto($id: String!) {
    getOnePhoto(id: $id) {
      file
      caption
      like
      comment
    }
  }
`;
const DeletePhoto = gql`
  mutation DeletePhoto($photoid: String!, $userid: String!, $file: String!) {
    deletephoto(photoid: $photoid, userid: $userid, file: $file) {
      message
    }
  }
`;
const DeletePhotoCard: React.FC<DeletePhotoCardType> = (props) => {
  const { loading, error, data } = useQuery(preDeletePhoto, { variables: { id: props.photoid } });
  const [deletePhoto, { loading: ld, error: err }] = useMutation(DeletePhoto, { refetchQueries: ["GETPHOTO"] });
  const [deleteImage] = useDeleteImageMutation();
  const userid = useSelector<any, string>((state) => state.auth.ID);
  const { enqueueSnackbar } = useSnackbar();

  async function onDeleteHandler() {
    const success = await deletePhoto({ variables: { photoid: props.photoid, userid: userid, file: data.getOnePhoto.file } });
    if ((success.data.deletephoto.message = "delete Photo Successful")) {
      deleteImage(data.getOnePhoto.file);
      enqueueSnackbar(success.data.deletephoto.message, { variant: "success" });
      props.onDelete();
    }
  }

  if (loading) return <ContentLoader />;
  if (error) return <ShowError error={error} />;
  if (err) enqueueSnackbar(err.message, { variant: "error" });

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" children={`Delete ${props.for}`} textAlign="center" />
        <Divider />
        {data.getOnePhoto.file && <CardMedia component="img" height="400" src={`${KEY.PHOTOSERVER}/images/?image=${data.getOnePhoto.file}`} />}
        <DisabledTextInput multiline={true} label="Caption" value={data.getOnePhoto.caption} />
        <DisableExpresion A={data.getOnePhoto.like} B={data.getOnePhoto.comment} Aicon="thumbup" Bicon="comments" />
      </CardContent>
      {ld ? (
        <CircularProgress color="inherit" sx={{ margin: "auto" }} />
      ) : err ? (
        <ShowError error={err} />
      ) : (
        <CardActions children={<Button sx={{ margin: "auto" }} onClick={onDeleteHandler} children="DELETE" />} />
      )}
    </Card>
  );
};

export default DeletePhotoCard;
