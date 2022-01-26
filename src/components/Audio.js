import { Button } from "react-bootstrap";
import { connect } from "react-redux";
import { backURL } from "../helpers/index";
import { Link } from "react-router-dom";
import * as actions from "./AudioHandler";

const AudioTrack = ({
  personal,
  player,
  track,
  index,
  playlist,
  loadAudio,
}) => {
  function truncText(text) {
    if (text && text.length > 40) {
      return text.substring(0, 40) + "...";
    } else return text;
  }

  return (
    <div className="d-flex mt-5">
      <div className="customAudio p-2 bg-dark text-white">
        <span className="ml-3 d-inline-block">
          {!personal ? `${index + 1} | ` : null}
          <span>
            {track?.originalFileName
              ? truncText(track?.originalFileName)
              : "Без названия"}
          </span>
        </span>
      </div>
      <Button onClick={() => loadAudio(track, playlist, index)}>
        <i
          className={`fas ${
            index === player?.indexInPlaylist && player?.isPlaying
              ? "fa-pause-circle"
              : "fa-play-circle"
          }`}
        ></i>
      </Button>
      <a
        className="btn btn-primary h-50 ml-1 my-auto"
        href={`${backURL}/${track?.url}`}
        role="button"
      >
        <i className="fas fa-download"></i>
      </a>
      {!personal ? (
        <div className="ml-2">
          <Link to={`/profile/${track?.owner?._id}`}>
            {track?.owner
              ? track?.owner?.nick
                ? track.owner.nick
                : track.owner.login
              : "user"}
          </Link>
        </div>
      ) : null}
    </div>
  );
};

export const CAudio = connect((state) => ({ player: state.player }), {
  loadAudio: actions.actionFullLoadAudio,
})(AudioTrack);
