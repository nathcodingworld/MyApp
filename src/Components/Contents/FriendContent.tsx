import { gql, useQuery } from "@apollo/client";
import { Accordion, AccordionDetails, AccordionSummary, Grid, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import ProfileCard from "../Cards/ProfileCard";
import ContentLoader from "../Component/ContentLoader";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ContentError from "../Component/ContentError";

const GETFRIEND = gql`
  query GETFRIEND($userid: String) {
    getFriend(userid: $userid) {
      friends {
        id
        userName
        description
        avatar
        heart
        messageChatRoom {
          userid {
            id
          }
          roomid
        }
      }
      friendRequest {
        id
        userName
        description
        avatar
        heart
        messageChatRoom {
          userid {
            id
          }
          roomid
        }
      }
    }
  }
`;

const FriendContent: React.FC = (props) => {
  const userid = useSelector<any, string>((state) => state.auth.ID);
  const { loading, error, data } = useQuery(GETFRIEND, { variables: { userid } });

  if (loading) return <ContentLoader />;
  if (error) return <ContentError Error={error} />;

  return (
    <>
      <Grid item xs={12}>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="FriendRequest" id="FriendRequest">
            <Typography children=" Friend Request" />
          </AccordionSummary>
          <AccordionDetails>
            {data.getFriend.friendRequest.map((friend: any) => {
              let roomid = "none";
              if (friend.messageChatRoom)
                for (const room of friend.messageChatRoom) {
                  if (room.userid.id === userid) {
                    roomid = room.roomid;
                    break;
                  }
                }
              return (
                <ProfileCard
                  userName={friend.userName}
                  description={friend.description}
                  heart={friend.heart}
                  avatar={friend.avatar}
                  id={friend.id}
                  key={friend.id}
                  friend={false}
                  request={false}
                  response={true}
                  roomid={roomid}
                />
              );
            })}
          </AccordionDetails>
        </Accordion>
      </Grid>

      {data.getFriend.friends.map((friend: any) => {
        let roomid = "none";
        if (friend.messageChatRoom)
          for (const room of friend.messageChatRoom) {
            if (room.userid.id === userid) {
              roomid = room.roomid;
              break;
            }
          }
        return (
          <ProfileCard
            userName={friend.userName}
            description={friend.description}
            heart={friend.heart}
            avatar={friend.avatar}
            id={friend.id}
            key={friend.id}
            friend={true}
            request={false}
            response={false}
            roomid={roomid}
          />
        );
      })}
    </>
  );
};

export default FriendContent;
