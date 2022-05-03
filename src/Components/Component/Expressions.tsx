import { Chip } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import CommentIcon from "@mui/icons-material/Comment";

type ExpressionType = {
  handleAClick: (e: any) => void;
  handleBClick: (e: any) => void;
  A: number;
  B: number;
  width: string;
  Aicon: "thumbup" | "thumbdown" | "comments";
  Bicon: "thumbup" | "thumbdown" | "comments";
  ADisable: boolean;
  BDisable: boolean;
};

const Expression: React.FC<ExpressionType> = (props) => {
  const Aicon = props.Aicon === "thumbup" ? <ThumbUpIcon /> : props.Aicon === "thumbdown" ? <ThumbDownIcon /> : <CommentIcon />;
  const Bicon = props.Bicon === "thumbup" ? <ThumbUpIcon /> : props.Bicon === "thumbdown" ? <ThumbDownIcon /> : <CommentIcon />;
  return (
    <>
      <Chip sx={{ width: props.width }} label={props.A} icon={Aicon} variant="outlined" onClick={props.handleAClick} disabled={props.ADisable} />
      <Chip sx={{ width: props.width }} label={props.B} icon={Bicon} variant="outlined" onClick={props.handleBClick} disabled={props.BDisable} />
      {props.children}
    </>
  );
};

export default Expression;
