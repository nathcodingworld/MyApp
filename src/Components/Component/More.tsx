import { SpeedDial, SpeedDialAction } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSnackbar } from "notistack";

type MoreType = {
  onDeleting: (state: boolean) => void;
  onEditing: (state: boolean) => void;
  for: string;
  authorize: boolean;
  sx: {};
};

const style = { "& .MuiSpeedDial-fab": { backgroundColor: "transparent", color: "black", boxShadow: "none" } };

const More: React.FC<MoreType> = (props) => {
  const { enqueueSnackbar } = useSnackbar();

  function onDeleteHandler(e: any) {
    e.stopPropagation();
    props.onDeleting(true);
  }
  function onEditingHandler(e: any) {
    props.onEditing(true);
    e.stopPropagation();
  }
  function notAuthorize(e: any) {
    e.stopPropagation();
    enqueueSnackbar("not Authorize", { variant: "error" });
  }

  return (
    <SpeedDial ariaLabel="More" icon={<MoreVertIcon />} direction="left" sx={{ ...style, ...props.sx }}>
      <SpeedDialAction key="Edit" icon={<EditIcon />} tooltipTitle={`Edit ${props.for}`} onClick={props.authorize ? onEditingHandler : notAuthorize} />
      <SpeedDialAction key="Delete" icon={<DeleteIcon />} tooltipTitle={`Delete ${props.for}`} onClick={props.authorize ? onDeleteHandler : notAuthorize} />
    </SpeedDial>
  );
};

export default More;
