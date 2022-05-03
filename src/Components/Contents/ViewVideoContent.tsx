import ViewVideoCard from "../Cards/ViewCards/ViewVideoCard";
import ViewVideoPrimaryCard from "../Cards/ViewCards/ViewVideoPrimaryCard";
import ViewVideoSecondaryCard from "../Cards/ViewCards/ViewVideoSecondaryCard";
import { gql, useQuery } from "@apollo/client";
import { useSelector } from "react-redux";
import ContentLoader from "../Component/ContentLoader";
import ContentError from "../Component/ContentError";

const GETONEVIDEO = gql`
  query GETONEVIDEO($id: String!) {
    getOneVideo(id: $id) {
      id
      userid {
        id
        userName
        avatar
      }
      description
      title
      view
      comment
      file
      like
      dislike
      disablelike
      disablecomment
      comments {
        userid {
          userName
          avatar
        }
        date
        comment
      }
    }
  }
`;

const ViewVideoContent: React.FC = (props) => {
  const videoid = useSelector<any, string>((state) => state.mediaData.videoid);
  const { loading, error, data } = useQuery(GETONEVIDEO, {
    variables: { id: videoid },
  });

  if (loading) return <ContentLoader />;
  if (error) return <ContentError Error={error} />;

  if (!data.getOneVideo.userid || !data.getOneVideo.userid.id) return <></>;

  return (
    <>
      <ViewVideoCard file={data.getOneVideo.file} like={data.getOneVideo.like} dislike={data.getOneVideo.dislike} id={data.getOneVideo.id} disablelike={data.getOneVideo.disablelike} />
      <ViewVideoPrimaryCard
        id={data.getOneVideo.id}
        title={data.getOneVideo.title}
        viewcomment={`${data.getOneVideo.view} views  ${data.getOneVideo.comment} comments`}
        file={data.getOneVideo.file}
        like={data.getOneVideo.like}
        dislike={data.getOneVideo.dislike}
        comments={data.getOneVideo.comments}
        disablelike={data.getOneVideo.disablelike}
        disablecomment={data.getOneVideo.disablecomment}
      />
      <ViewVideoSecondaryCard description={data.getOneVideo.description} userid={data.getOneVideo.userid} />
    </>
  );
};

export default ViewVideoContent;
