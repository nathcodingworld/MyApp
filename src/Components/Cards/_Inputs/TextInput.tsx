import { TextField } from "@mui/material";

type TextInputType = {
  value: string;
  label: string;
  type: string;
  variant: "standard" | undefined;
  accepted: boolean;
  multiline: boolean;
  setData: (args: { accepted: boolean; Msg: string; value: string }) => void;
};

const conntentStyle = {
  width: "100%",
};

const TextInput: React.FC<TextInputType> = (props) => {
  function onValidateTextHandler(e: any) {
    const value = e.target.value;
    let Msg = "";
    let accepted = false;
    let notaccepted = false;
    const data = props.type === "password" ? ["<", ">", "/", "(", ")", "{", "}", "[", "]", "`", "|", "?", ".", ",", "$", "!", " "] : ["<", ">", "/", "{", "}", "[", "]", "`", "$"];
    for (const lt of data) {
      if (value.includes(lt)) {
        notaccepted = true;
        break;
      }
    }
    if (value === "") Msg = "Must not empty";
    else if (value.length < 5) Msg = " must grater than 5";
    else if (notaccepted) Msg = props.type === "password" ? "Must not have < > / ( ){ }[ ] `| ? . , $ ! " : "must not containt <, >, /, {, }, [, ], `, $";
    else accepted = true;

    props.setData({
      accepted,
      Msg,
      value,
    });
  }

  if (props.multiline) {
    return <TextField label={props.label} multiline sx={{ ...conntentStyle, marginTop: "10px" }} onChange={onValidateTextHandler} value={props.value} />;
  }

  return <TextField label={props.label} variant={props.variant} type={props.type} fullWidth color={props.accepted ? "success" : "error"} onChange={onValidateTextHandler} value={props.value} />;
};

export default TextInput;
