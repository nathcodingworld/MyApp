import { gql, useMutation, useQuery } from "@apollo/client";
import { Button, Card, CardActions, CardContent, CardHeader, Chip, CircularProgress, Divider, Typography } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import UserAvatar from "../../UI/UserAvatar";
import FavoriteTwoToneIcon from "@mui/icons-material/FavoriteTwoTone";
import { authAction } from "../../../Providers/ReduxProvider";
import ContentLoader from "../../Component/ContentLoader";
import { useDeleteAudioMutation } from "../../../Providers/APIs/AudioApi";
import { useDeleteVideoMutation } from "../../../Providers/APIs/VideoApi";
import { useDeleteImageMutation } from "../../../Providers/APIs/ImageApi";
import { useSnackbar } from "notistack";
import ShowError from "../../Component/ShowError";
import cookie from "react-cookies";

type DeleteUserCardType = {
  for: string;
  onDelete: () => void;
};

const GetAllFiles = gql`
  query GetAllFiles($id: String!) {
    preDeleteProfile(id: $id) {
      allVideoFiles
      allPhotoFiles
      allAudioFiles
      heart
    }
  }
`;

const DeleteProfile = gql`
  mutation DeleteProfile($userid: String!) {
    deleteprofile(userid: $userid) {
      message
    }
  }
`;

const DeleteUserCard: React.FC<DeleteUserCardType> = (props) => {
  const userid = useSelector<any, string>((state) => state.auth.ID);
  const username = useSelector<any, string>((state) => state.auth.userName);
  const bio = useSelector<any, string>((state) => state.auth.bio);
  const { loading, error, data } = useQuery(GetAllFiles, { variables: { id: userid } });
  const [deleteAccount, { loading: ld, error: err }] = useMutation(DeleteProfile);
  const [deleteImage] = useDeleteImageMutation();
  const [deleteAudio] = useDeleteAudioMutation();
  const [deleteVideo] = useDeleteVideoMutation();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  async function onDeleteHandler() {
    try {
      const success = await deleteAccount({ variables: { userid: userid } });
      if (success) {
        const allvideofiles: string[] = data.preDeleteProfile.allVideoFiles;
        const allphotofiles: string[] = data.preDeleteProfile.allPhotoFiles;
        const allaudiofiles: string[] = data.preDeleteProfile.allAudioFiles;
        if (allvideofiles) allvideofiles.forEach((file) => deleteVideo(file));
        if (allaudiofiles) allaudiofiles.forEach((file) => deleteAudio(file));
        if (allphotofiles) allphotofiles.forEach((file) => deleteImage(file));
        dispatch(authAction.Logout());
        enqueueSnackbar(success.data.deleteprofile.message, { variant: "success" });
        cookie.remove("userdata");
        props.onDelete();
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
      </CardContent>
      <CardHeader
        avatar={<UserAvatar />}
        title={username}
        subheader={bio}
        action={<Chip sx={{ width: "max-content" }} label={data.preDeleteProfile.heart} icon={<FavoriteTwoToneIcon />} color="secondary" variant="outlined" />}
      />
      <Divider />
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

export default DeleteUserCard;
