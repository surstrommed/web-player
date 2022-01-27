import { Button } from "react-bootstrap";
import { connect } from "react-redux";
import { backURL } from "../helpers/index";
import { Link } from "react-router-dom";
import * as actions from "./AudioHandler";
import { skipValue } from "./../helpers/index";

const AudioTrack = ({
  personal,
  player,
  track,
  index,
  playlist,
  loadAudio,
  loadedTracks,
  route,
}) => {
  function truncText(text) {
    if (text && text.length > 40) {
      return text.substring(0, 40) + "...";
    } else return text;
  }
  if (!index) {
    index = playlist.findIndex((audio) => audio?._id === track?._id);
  }

  return (
    <div className="d-flex mt-5">
      <div className="customAudio p-2 bg-dark text-white">
        <span className="ml-3 d-inline-block">
          {route.url === "/search"
            ? index + 1 + loadedTracks?.skipTracks
            : index + 1}{" "}
          |
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
            track._id === player?.track?._id && player?.isPlaying
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
        <div className="ml-5">
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

export const CAudio = connect(
  (state) => ({
    player: state.player,
    loadedTracks: state.loadedTracks,
    route: state.route,
  }),
  {
    loadAudio: actions.actionFullLoadAudio,
  }
)(AudioTrack);
