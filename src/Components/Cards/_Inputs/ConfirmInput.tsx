import { TextField } from "@mui/material";

type ConfirmInputType = {
  toConfirm: string;
  accepted: boolean;
  setData: (args: { accepted: boolean; Msg: string; value: string }) => void;
};

const ConfirmInput: React.FC<ConfirmInputType> = (props) => {
  function onValidateAndStoreConfirm(e: any) {
    const value = e.target.value!;
    let Msg = "";
    let accepted = false;
    if (value !== props.toConfirm) Msg = "Not Equal";
    else accepted = true;

    props.setData({
      value,
      Msg,
      accepted,
    });
  }

  return <TextField label="Confirm Password" variant="standard" type="password" fullWidth color={props.accepted ? "success" : "error"} onChange={onValidateAndStoreConfirm} />;
};

export default ConfirmInput;
