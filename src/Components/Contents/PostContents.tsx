import { gql, useQuery } from "@apollo/client";
import { useSelector } from "react-redux";
import PostCard from "../Cards/PostCard";
import ContentError from "../Component/ContentError";
import ContentLoader from "../Component/ContentLoader";

const GETPOST = gql`
  query GETPOST($authorid: String!) {
    getPost(authorid: $authorid) {
      id
      userid {
        id
        userName
        avatar
      }
      content
      date
      file
      like
      comment
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
const PostContents: React.FC = (props) => {
  const authorid = useSelector<any, string>((state) => state.auth.authorid);
  const { loading, error, data } = useQuery(GETPOST, { variables: { authorid } });
  if (loading) return <ContentLoader />;
  if (error) return <ContentError Error={error} />;

  return (
    <>
      {data.getPost.map((data: any) => {
        if (!data.userid) return;
        return (
          <PostCard
            userid={data.userid.id}
            name={data.userid.userName}
            propic={data.userid.avatar}
            comments={data.comments}
            comment={data.comment}
            disablelike={data.disablelike}
            disablecomment={data.disablecomment}
            date={data.date}
            like={data.like}
            content={data.content}
            id={data.id}
            file={data.file}
            key={data.id}
          />
        );
      })}
    </>
  );
};

export default PostContents;
