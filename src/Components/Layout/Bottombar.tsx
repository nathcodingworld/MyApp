import { AppBar, Box } from "@mui/material";
import { Theme } from "@mui/system";
import { useSelector } from "react-redux";
import AudioFloatingController from "../Float/AudioFloatingController";
import MiniFloatingPlayer from "../Float/MiniFloatingPlayer";

const Bottombar: React.FC = (prop) => {
  const float = useSelector<any, string>((state) => state.modal.content);
  const videoFloat = float === "video";
  const audioFloat = float === "audio";

  const style = {
    top: "auto",
    bottom: 0,
    bgcolor: (theme: Theme) => (theme.palette.mode === "dark" ? theme.palette.common.black : theme.palette.common.white),
    backgroundImage: "none",
    height: videoFloat ? "300px" : audioFloat ? "100px" : 0,
    width: videoFloat ? "400px" : audioFloat ? "100%" : 0,
    right: videoFloat ? 35 : 0,
    zIndex: 3000,
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" sx={style}>
        {videoFloat && <MiniFloatingPlayer />}
        {audioFloat && <AudioFloatingController />}
      </AppBar>
    </Box>
  );
};

export default Bottombar;
