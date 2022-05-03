import { gql, useQuery } from "@apollo/client";
import { Avatar, Card, CardContent, CardHeader, Divider, Grid, Stack, Typography } from "@mui/material";
import KEY from "../../../Key/KEY";
import CardHoverMedia from "../../Component/CardHoverMedia";
import ContentLoader from "../../Component/ContentLoader";
import ShowError from "../../Component/ShowError";

type ViewVideoSecondaryCardType = {
  description: string;
  userid: {
    id: string;
    userName: string;
    avatar: string;
  };
};

const MORE = gql`
  query MORE($userid: String!) {
    more(userid: $userid) {
      title
      view
      like
      file
      thumbnail
    }
  }
`;

const ViewVideoSecondaryCard: React.FC<ViewVideoSecondaryCardType> = (props) => {
  const { loading, error, data } = useQuery(MORE, { variables: { userid: props.userid.id } });

  if (loading) return <ContentLoader />;
  if (error) return <ShowError error={error} />;

  return (
    <Grid item md={4} xs={12}>
      <Card>
        <CardHeader avatar={<Avatar alt={props.userid.userName} src={`${KEY.PHOTOSERVER}/images/?image=${props.userid.avatar}`} />} title={props.userid.userName} />
        <CardContent children={props.description} />
        <Divider />
        <Typography children={`more of ${props.userid.userName}`} fontWeight="bold" p={1} />
        <Divider />
        {data.more.map((video: any, i: number) => {
          return (
            <Stack direction="row" sx={{ p: "5px 0", borderBottom: "1px solid gray" }} key={i}>
              <CardHoverMedia thumbnail={video.thumbnail} file={video.file} width="50%" />
              <CardHeader title={video.title} subheader={`${video.view} views   ${video.like} likes`} sx={{ width: "50%" }} />
            </Stack>
          );
        })}
      </Card>
    </Grid>
  );
};

export default ViewVideoSecondaryCard;
