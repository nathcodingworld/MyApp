import { Box, Card, CardActions, FormControl, IconButton, InputLabel, MenuItem, Modal, Select } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { pageAction } from "../../Providers/ReduxProvider";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useTheme } from "@mui/material/styles";

const style = {
  position: "absolute" as "absolute",
  top: "100px",
  left: "50%",
  transform: "translateX(-50%)",
  width: 400,
  bgcolor: "#181818",
  border: "1.5px solid #fff",
  boxShadow: 24,
};
const actionstyle = {
  display: "flex",
  width: "100%",
  alignItems: "center",
  justifyContent: "center",
};

const SettingModal: React.FC = (props) => {
  const open = useSelector<any, boolean>((state) => state.page.openSetting);
  const code = useSelector<any, string>((state) => state.page.theme);
  const dispatch = useDispatch();
  const theme = useTheme();
  function onCloseHandler() {
    dispatch(pageAction.toggleSettingModal());
  }
  function onsetAppearanceHandler() {
    dispatch(pageAction.setPageAppearance());
  }
  function onsetThemeHandler(e: any) {
    dispatch(pageAction.setPageTheme(e.target.value));
  }

  return (
    <Modal open={open} onClose={onCloseHandler} sx={{ overflowY: "scroll" }}>
      <Box sx={style}>
        <Card>
          <CardActions sx={actionstyle}>
            {theme.palette.mode} mode
            <IconButton sx={{ ml: 1 }} onClick={onsetAppearanceHandler} color="inherit">
              {theme.palette.mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </CardActions>
          <CardActions sx={{ p: 2 }}>
            <FormControl fullWidth variant="standard">
              <InputLabel id="pageTheme" children="Theme" />
              <Select labelId="pageTheme" id="Themeselect" value={code === "none" ? "" : code} label="Theme" onChange={onsetThemeHandler}>
                <MenuItem value={"none"}>
                  <em>None</em>
                </MenuItem>
                <MenuItem value={"cloud"}>Cloud</MenuItem>
                <MenuItem value={"steel"}>Steel</MenuItem>
                <MenuItem value={"sea"}>Sea</MenuItem>
                <MenuItem value={"indigo"}>Indigo</MenuItem>
                <MenuItem value={"chocolate"}>Chocolate</MenuItem>
              </Select>
            </FormControl>
          </CardActions>
        </Card>
      </Box>
    </Modal>
  );
};

export default SettingModal;
