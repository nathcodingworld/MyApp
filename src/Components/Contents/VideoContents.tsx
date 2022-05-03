import VideoCard from "../Cards/VideoCard";
import { gql, useQuery } from "@apollo/client";
import ContentLoader from "../Component/ContentLoader";
import { useSelector } from "react-redux";
import ContentError from "../Component/ContentError";

const GETVIDEO = gql`
  query GETVIDEO($authorid: String!) {
    getVideo(authorid: $authorid) {
      id
      userid {
        id
        userName
        avatar
      }
      file
      thumbnail
      title
      disablelike
      disablecomment
      description
      view
      like
    }
  }
`;

const VideoContents: React.FC = (props) => {
  const authorid = useSelector<any, string>((state) => state.auth.authorid);
  const { loading, error, data } = useQuery(GETVIDEO, { variables: { authorid } });

  if (loading) return <ContentLoader />;
  if (error) return <ContentError Error={error} />;

  return (
    <>
      {data.getVideo.map((data: any) => {
        if (!data.userid || !data.userid.id) return;
        return (
          <VideoCard
            id={data.id}
            userid={data.userid}
            file={data.file}
            thumbnail={data.thumbnail}
            title={data.title}
            disablelike={data.disablelike}
            disablecomment={data.disablecomment}
            description={data.description}
            view={data.view}
            like={data.like}
            key={data.id}
          />
        );
      })}
    </>
  );
};

export default VideoContents;
