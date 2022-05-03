import { createTheme, ThemeProvider } from "@mui/material";
import { blueGrey, brown, grey, indigo, teal } from "@mui/material/colors";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const html = window.document.querySelector("html")?.classList;

const modes = ["darknone", "lightnone", "darkcloud", "lightcloud", "darkchocolate", "darksteel", "lightsteel", "darkindigo", "lightindigo", "lightchocolate", "lightsea", "darksea"];

const StyleProvider: React.FC = (props) => {
  const mode = useSelector<any, "dark" | "light">((state) => state.page.mode);
  const code = useSelector<any, "cloud" | "steel" | "none" | "chocolate" | "indigo" | "sea">((state) => state.page.theme);
  const color = code === "chocolate" ? brown : code === "indigo" ? indigo : code === "steel" ? blueGrey : code === "sea" ? teal : grey;
  const darkPaperTheme = code === "none" ? "#121212" : color[700];
  const lightPaperTheme = code === "none" ? "#fff" : color[200];
  const darkMainTheme = code === "none" ? "#121212" : color[900];
  const lightMainTheme = code === "none" ? "#fff" : color[400];
  const theme = createTheme({
    palette: {
      mode: mode,
      common: {
        black: "#0f0f0f",
        white: "#fff",
      },
      background: {
        paper: mode === "dark" ? darkPaperTheme : lightPaperTheme,
        default: mode === "dark" ? darkMainTheme : lightMainTheme,
      },
    },
  });

  useEffect(() => {
    modes.forEach((mode) => {
      html?.remove(mode);
    });
    html?.add(mode + code);
  }, [mode, code]);

  return <ThemeProvider theme={theme}>{props.children}</ThemeProvider>;
};

export default StyleProvider;
