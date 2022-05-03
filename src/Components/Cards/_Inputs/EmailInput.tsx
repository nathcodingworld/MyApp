import { TextField } from "@mui/material";
import { useState } from "react";

type EmailInputType = {
  accepted: boolean;
  setData: (args: { accepted: boolean; Msg: string; value: string }) => void;
};

const EmailInput: React.FC<EmailInputType> = (props) => {
  function onValidateAndStoreEmail(e: any) {
    const value = e.target.value;
    const length = value.split("@");
    const end = value.split(".");
    let accepted = false;
    let Msg = "";
    if (value === "") Msg = "must not empty";
    else if (length.length !== 2) Msg = "Must have 1 @";
    else if (end[end.length - 1] !== "com") Msg = "must valid email";
    else accepted = true;

    props.setData({
      accepted,
      Msg,
      value,
    });
  }

  return <TextField label="Email" variant="standard" type="email" fullWidth color={props.accepted ? "success" : "error"} onChange={onValidateAndStoreEmail} />;
};

export default EmailInput;
