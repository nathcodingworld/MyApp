import ReactPlayer from "react-player";
import KEY from "../../Key/KEY";

type MiniVideoPlayerType = {
  file: string;
  Ref: any;
  play: boolean;
  onEnded: () => void;
  onUpdate: (state: any) => void;
};

const MiniVideoPlayer: React.FC<MiniVideoPlayerType> = (props) => {
  return <ReactPlayer ref={props.Ref} url={`${KEY.VIDEOSERVER}/videos/?video=${props.file}`} playing={props.play} height="226px" width="400px" onEnded={props.onEnded} onProgress={props.onUpdate} />;
};

export default MiniVideoPlayer;
