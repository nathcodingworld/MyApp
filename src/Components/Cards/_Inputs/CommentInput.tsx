import { TextField } from "@mui/material";

type CommentInputType = {
  setData: (args: { value: string; Msg: string; accepted: boolean }) => void;
  accepted: boolean;
  onPressEnter: (e: any) => void;
  value: string;
  disabled: boolean;
  reff: any;
};

const CommentInput: React.FC<CommentInputType> = (props) => {
  function onValidateCommentHandler(e: any) {
    const value = e.target.value;
    let accepted = false;
    let notaccepted = false;
    const notacceptable = ["<", ">", "/", "{", "}", "[", "]", "`", "$", "(", ")"];
    let Msg = "";
    for (const codingletter of notacceptable) {
      if (value.includes(codingletter)) {
        notaccepted = true;
        break;
      }
    }
    if (notaccepted) Msg = "must not contain <, >, /, {, }, [, ], `, $ , ( , )";
    else accepted = true;
    props.setData({
      value,
      Msg,
      accepted,
    });
  }
  return (
    <TextField
      label="Comment"
      variant="standard"
      value={props.value}
      color={props.accepted ? "success" : "error"}
      sx={{ width: "100%" }}
      onChange={onValidateCommentHandler}
      onKeyDown={props.onPressEnter}
      disabled={props.disabled}
      inputRef={props.reff}
    />
  );
};

export default CommentInput;
