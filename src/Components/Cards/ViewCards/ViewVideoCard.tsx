import { Card, Grid } from "@mui/material";
import { useSelector } from "react-redux";
import VideoPlayer from "../../Player/VideoPlayer";

type ViewVideoCardType = {
  id: string;
  file: string;
  like: number;
  dislike: number;
  disablelike: boolean;
};

const ViewVideoCard: React.FC<ViewVideoCardType> = (props) => {
  const expanded = useSelector<any>((state) => state.mediaData.videoState.expand);

  return (
    <>
      {expanded && (
        <Grid item xs={12}>
          <Card sx={{ backgroundColor: "black" }}>
            <VideoPlayer file={props.file} like={props.like} dislike={props.dislike} id={props.id} disablelike={props.disablelike} />
          </Card>
        </Grid>
      )}
    </>
  );
};

export default ViewVideoCard;
