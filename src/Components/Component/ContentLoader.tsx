import { CircularProgress, Grid } from "@mui/material";
import { Box } from "@mui/system";

const style = { position: "absolute", top: "50%", left: "50%", transform: "translate (-50%, -50%)" };
const ContentLoader: React.FC = (props) => {
  return (
    <Grid item xs={12}>
      <Box width="100%" height="100%">
        <CircularProgress sx={style} />
      </Box>
    </Grid>
  );
};

export default ContentLoader;
