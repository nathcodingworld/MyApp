import { Card, CardMedia } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import KEY from "../../../Key/KEY";

const style = {
  position: "relative",
  backgroundColor: "black",
  width: { md: "calc(100% - 400px)", xs: "100%" },
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
};

function getHW() {
  const maxHeight = window.innerWidth > 900 ? 80 : 266;
  const maxWidth = window.innerWidth > 900 ? 500 : 100;
  const height = window.innerHeight - maxHeight;
  const twitdth = window.innerWidth > 1400 ? 1400 : window.innerWidth;
  const width = twitdth - maxWidth;
  const HW = width > height ? height : width;
  return HW;
}

const ViewPhotoCard: React.FC = (props) => {
  const [S, setS] = useState(getHW());
  const url = useSelector<any, string>((State) => State.mediaData.image);

  window.onresize = () => {
    setS(getHW());
  };

  const mediaStyle = { maxHeight: S, maxWidth: S, margin: "auto" };

  return (
    <Card sx={{ ...style, height: { md: "100%", xs: S } }}>
      <div></div>
      <CardMedia src={`${KEY.PHOTOSERVER}/images/?image=${url}`} component="img" height="100%" sx={mediaStyle} />
      <div></div>
    </Card>
  );
};

export default ViewPhotoCard;
