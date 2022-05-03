import { Card, CardContent, CardHeader, Grid, Typography } from "@mui/material";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import ErrorIcon from "@mui/icons-material/Error";
import GppBadIcon from "@mui/icons-material/GppBad";
import DiscFullIcon from "@mui/icons-material/DiscFull";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import NoAccountsIcon from "@mui/icons-material/NoAccounts";
import { ApolloError } from "@apollo/client";
import { GraphQLError } from "graphql";
type ContentErrorType = {
  Error: ApolloError;
};

const ContentError: React.FC<ContentErrorType> = (props) => {
  return (
    <>
      {props.Error.graphQLErrors.map((error: GraphQLError) => {
        let errcode: string = "";
        const info = error.extensions.info;
        const code = error.extensions.code;
        const type = error.extensions.type;
        if (typeof code === "string") errcode = code;
        const erricon =
          type === "Internal" ? (
            <DiscFullIcon color="error" fontSize="large" />
          ) : type === "Auth" ? (
            <NoAccountsIcon color="error" fontSize="large" />
          ) : type === "Invalid" ? (
            <GppBadIcon color="error" fontSize="large" />
          ) : type === "Broken" ? (
            <PriorityHighIcon color="error" fontSize="large" />
          ) : type === "Crash" ? (
            <NewReleasesIcon color="error" fontSize="large" />
          ) : (
            <ErrorIcon color="error" fontSize="large" />
          );

        return (
          <Grid item xs={12}>
            <Card>
              <CardContent children={<Typography children="Ooops!" variant="h1" color="error" />} />
              <CardHeader avatar={erricon} title={errcode} subheader={error.message} />
              {typeof info === "string" && <CardContent children={info} sx={{ color: (theme) => theme.palette.error.light }} />}
            </Card>
          </Grid>
        );
      })}
    </>
  );
};

export default ContentError;
