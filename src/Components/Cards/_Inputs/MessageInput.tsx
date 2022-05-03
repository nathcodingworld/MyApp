import { TextField } from "@mui/material";

type MessageInputType = {
  setData: (args: { value: string; Msg: string; accepted: boolean }) => void;
  accepted: boolean;
  value: string;
};

const MessageInput: React.FC<MessageInputType> = (props) => {
  function onValidateMessageHandler(e: any) {
    const value = e.target.value;
    let accepted = false;
    let notaccepted = false;
    const notacceptable = ["<", ">", "/", "{", "}", "[", "]", "`", "(", ")"];
    let Msg = "";
    for (const codingletter of notacceptable) {
      if (value.includes(codingletter)) {
        notaccepted = true;
        break;
      }
    }
    if (notaccepted) Msg = "must not contain <, >, /, {, }, [, ], `, ( , )";
    else accepted = true;
    props.setData({
      value,
      Msg,
      accepted,
    });
  }

  return <TextField label="Message" value={props.value} color={props.accepted ? "success" : "error"} multiline fullWidth onChange={onValidateMessageHandler} />;
};

export default MessageInput;
