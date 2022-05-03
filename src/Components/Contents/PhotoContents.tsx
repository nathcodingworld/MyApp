import { gql, useQuery } from "@apollo/client";
import { useSelector } from "react-redux";
import PhotoCard from "../Cards/PhotoCard";
import ContentError from "../Component/ContentError";
import ContentLoader from "../Component/ContentLoader";

const GETPHOTO = gql`
  query GETPHOTO($authorid: String!) {
    getPhoto(authorid: $authorid) {
      id
      file
      userid {
        id
      }
    }
  }
`;

const PhotoContents: React.FC = (props) => {
  const authorid = useSelector<any, string>((state) => state.auth.authorid);
  const { loading, error, data } = useQuery(GETPHOTO, { variables: { authorid } });

  if (loading) return <ContentLoader />;
  if (error) return <ContentError Error={error} />;

  return (
    <>
      {data.getPhoto.map((img: any) => {
        if (!img.userid || !img.userid.id) return;
        return <PhotoCard file={img.file} key={img.id} id={img.id} userid={img.userid.id} />;
      })}
    </>
  );
};

export default PhotoContents;
