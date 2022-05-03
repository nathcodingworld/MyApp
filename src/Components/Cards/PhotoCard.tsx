import { Card, CardMedia, Grid } from "@mui/material";
import { useDispatch } from "react-redux";
import KEY from "../../Key/KEY";
import { mediaDataAction, modalAction } from "../../Providers/ReduxProvider";
import { Theme } from "@mui/system";

type PhotoCardType = {
  file: string;
  id: string;
  userid: string;
};

const PhotoCardStyle = {
  width: "100%",
  aspectRatio: "1/1",
  "&:hover": {
    transform: (theme: Theme) => (theme.breakpoints.down("sm") ? "scale(1)" : "scale(1.5)"),
    transition: "transform 400ms ease-in-out",
  },
};

const PhotoCard: React.FC<PhotoCardType> = (props) => {
  const dispatch = useDispatch();

  function openViewPhotoHandler() {
    dispatch(mediaDataAction.setPhotoData({ image: props.file, id: props.id, userid: props.userid }));
    dispatch(modalAction.ToggleViewtModal());
  }

  return (
    <Grid item lg={3} md={4} sm={6} xs={12}>
      <Card sx={PhotoCardStyle} onClick={openViewPhotoHandler} id={props.id}>
        <CardMedia height="100%" component="img" src={`${KEY.PHOTOSERVER}/images/?image=${props.file}`} />
      </Card>
    </Grid>
  );
};

export default PhotoCard;
