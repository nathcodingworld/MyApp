import { Input, TextField } from "@mui/material";

type DisabledTextInputType = {
  value: string;
  label: string;
  multiline: boolean;
};

const conntentStyle = {
  width: "100%",
  marginTop: "10px",
};

const DisabledTextInput: React.FC<DisabledTextInputType> = (props) => {
  if (props.multiline) return <TextField disabled={true} value={props.value} sx={conntentStyle} multiline label={props.label} />;
  return <TextField disabled={true} value={props.value} fullWidth type="text" variant="standard" label={props.label} />;
};

export default DisabledTextInput;
