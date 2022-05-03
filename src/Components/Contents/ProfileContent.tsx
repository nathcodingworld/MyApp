import { gql, useQuery } from "@apollo/client";
import { useSelector } from "react-redux";
import ProfileCard from "../Cards/ProfileCard";
import ContentError from "../Component/ContentError";
import ContentLoader from "../Component/ContentLoader";

const fetch = gql`
  query GETPROFILE($userid: String) {
    getFriend(userid: $userid) {
      friends {
        id
      }
      friendRequest {
        id
      }
      sentRequest
    }
    getProfiles {
      id
      userName
      description
      heart
      avatar
      messageChatRoom {
        userid {
          id
        }
        roomid
      }
    }
  }
`;

const ProfileContent: React.FC = (props) => {
  const id = useSelector<any, string>((state) => state.auth.ID);
  const { loading, error, data } = useQuery(fetch, { variables: { userid: id } });
  if (loading) return <ContentLoader />;
  if (error) return <ContentError Error={error} />;

  const sent = data.getFriend.sentRequest;
  const recieve = data.getFriend.friendRequest.map((res: any) => res.id);
  const friends = data.getFriend.friends.map((fri: any) => fri.id);

  return (
    <>
      {data.getProfiles.map((d: { id: string; userName: string; avatar: string; description: string; heart: number; messageChatRoom: { userid: { id: string }; roomid: string }[] }) => {
        let friend = false;
        let requested = false;
        let toresponse = false;
        let roomid = "none";
        if (sent.includes(d.id)) requested = true;
        if (recieve.includes(d.id)) toresponse = true;
        if (friends.includes(d.id)) friend = true;

        for (const room of d.messageChatRoom) {
          if (room.userid.id === id) {
            roomid = room.roomid;
            break;
          }
        }

        return (
          <ProfileCard
            userName={d.userName}
            description={d.description}
            heart={d.heart}
            avatar={d.avatar}
            id={d.id}
            key={d.id}
            friend={friend}
            request={requested}
            response={toresponse}
            roomid={roomid}
          />
        );
      })}
    </>
  );
};

export default ProfileContent;
