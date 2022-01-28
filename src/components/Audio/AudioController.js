import { Button } from "react-bootstrap";
import { connect } from "react-redux";
import * as actions from "./../../actions/types";

const AudioController = ({
  player,
  prevAudio,
  nextAudio,
  setVolume,
  setSeekTime,
  loadAudio,
}) => {
  function truncText(text) {
    if (text && text.includes(".mp3")) {
      return text.replace(".mp3", "");
    } else return text;
  }

  function convertTime(dur) {
    let minutes = Math.floor(dur / 60);
    let seconds = Math.floor(dur - minutes * 60);
    let formatSeconds = seconds < 10 ? `0${seconds}` : seconds;
    return Number.isNaN(dur) || dur === undefined
      ? "00:00"
      : `${minutes}:${formatSeconds}`;
  }
  return (
    <div className="AudioController">
      <span className="SongName">
        {player?.track ? truncText(player?.track?.originalFileName) : ""}
      </span>
      <div className="Buttons m-2">
        <Button
          className="mr-2"
          disabled={player?.track ? false : true}
          onClick={() => prevAudio(player?.indexInPlaylist)}
        >
          <i className="fas fa-step-backward"></i>
        </Button>
        <Button
          disabled={player?.track ? false : true}
          className="mr-2"
          onClick={() =>
            loadAudio(player?.track, player?.playlist, player?.indexInPlaylist)
          }
        >
          <i
            className={`fas fa-${player?.isPlaying ? "pause" : "caret-right"}`}
          ></i>
        </Button>
        <Button
          disabled={player?.track ? false : true}
          onClick={() => nextAudio(player?.indexInPlaylist)}
        >
          <i className="fas fa-step-forward"></i>
        </Button>
        <div className="Duration">
          <span>{convertTime(player?.currentTime)}</span>
          <input
            disabled={player?.track ? false : true}
            type="range"
            className="form-range mt-3 w-50"
            min={0}
            max={
              !player?.duration || Number.isNaN(player?.duration)
                ? 0
                : player?.duration
            }
            value={player?.currentTime}
            step={1}
            onChange={(e) => {
              setSeekTime(+e.target.value);
            }}
          />
          <span>{convertTime(player?.duration)}</span>
        </div>
      </div>
      <div className="Volume m-2">
        <input
          type="range"
          className="form-range"
          min={0}
          max={100}
          value={player?.volume * 100}
          onChange={(e) => {
            let volume = e.target.value / 100;
            setVolume(volume);
          }}
        />
        <span
          style={{
            fontSize: "14px",
            position: "absolute",
            marginTop: "0.5vh",
            marginLeft: "2vh",
          }}
        >
          {player?.volume && player?.volume > 0 ? (
            `${Math.trunc(player?.volume * 100)}%`
          ) : (
            <i className="fas fa-volume-mute"></i>
          )}
        </span>
      </div>
    </div>
  );
};

export const CAudioController = connect(
  (state) => ({ promise: state.promise, player: state.player }),
  {
    loadAudio: actions.actionFullLoadAudio,
    playAudio: actions.actionFullPlayAudio,
    pauseAudio: actions.actionFullPauseAudio,
    nextAudio: actions.actionNextTrack,
    prevAudio: actions.actionPrevTrack,
    setVolume: actions.actionFullSetVolume,
    setSeekTime: actions.actionFullSetSeekTimeTrack,
  }
)(AudioController);
