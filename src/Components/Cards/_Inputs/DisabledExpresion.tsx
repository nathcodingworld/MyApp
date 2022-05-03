import { Chip } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import CommentIcon from "@mui/icons-material/Comment";

type DisableExpresionType = {
  A: number;
  B: number;
  Aicon: "thumbup" | "thumbdown" | "comments";
  Bicon: "thumbup" | "thumbdown" | "comments";
};

const DisableExpresion: React.FC<DisableExpresionType> = (props) => {
  const Aicon = props.Aicon === "thumbup" ? <ThumbUpIcon /> : props.Aicon === "thumbdown" ? <ThumbDownIcon /> : <CommentIcon />;
  const Bicon = props.Bicon === "thumbup" ? <ThumbUpIcon /> : props.Bicon === "thumbdown" ? <ThumbDownIcon /> : <CommentIcon />;
  return (
    <>
      <Chip sx={{ width: "150px" }} label={props.A} icon={Aicon} variant="outlined" disabled={true} />
      <Chip sx={{ width: "150px" }} label={props.B} icon={Bicon} variant="outlined" disabled={true} />
    </>
  );
};

export default DisableExpresion;
