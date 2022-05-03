import { gql, useQuery } from "@apollo/client";
import { useSelector } from "react-redux";
import AudioCard from "../Cards/AudioCard";
import ContentError from "../Component/ContentError";
import ContentLoader from "../Component/ContentLoader";

const GETAUDIO = gql`
  query GETAUDIO($authorid: String!) {
    getAudio(authorid: $authorid) {
      userid {
        id
        avatar
      }
      id
      file
      title
      owner
      cover
      coverby
    }
  }
`;

const AudioContents: React.FC = (props) => {
  const authorid = useSelector<any, string>((state) => state.auth.authorid);
  const { loading, error, data } = useQuery(GETAUDIO, { variables: { authorid } });

  if (loading) return <ContentLoader />;
  if (error) return <ContentError Error={error} />;

  return (
    <>
      {data.getAudio.map((data: any) => {
        if (!data.userid || !data.userid.id) return;
        return <AudioCard userid={data.userid} id={data.id} file={data.file} title={data.title} owner={data.owner} cover={data.cover} coverby={data.coverby} key={data.id} />;
      })}
    </>
  );
};

export default AudioContents;
