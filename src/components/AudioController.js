import { Button } from "react-bootstrap";
import { connect } from "react-redux";
import { useState } from "react";
import {
  actionPlayAudio,
  actionPauseAudio,
  actionVolumeAudio,
} from "./../actions/index";

const AudioController = ({
  name,
  currentTime,
  duration,
  volume,
  playAudio,
  pauseAudio,
  volumeAudio,
  player,
}) => {
  const [vol, setVol] = useState(volume);
  const [reproduction, setReproduction] = useState(player?.isPlaying);

  function truncText(text) {
    if (text && text.length > 40) {
      return text.substring(0, 40) + "...";
    } else return text;
  }

  function convertTime(dur) {
    let minutes = Math.floor(dur / 60);
    let seconds = parseInt((dur % 60) * 100) / 100;
    return `${minutes}:${seconds}`;
  }

  return (
    <div className="AudioController">
      <span className="SongName">{truncText(name)}</span>
      <div className="Buttons m-2">
        <Button className="mr-2">
          <i className="fas fa-step-backward"></i>
        </Button>
        <Button
          className="mr-2"
          onClick={() => {
            setReproduction(!reproduction);
            reproduction ? pauseAudio(true) : playAudio(true);
          }}
        >
          <i className={`fas fa-${reproduction ? "pause" : "caret-right"}`}></i>
        </Button>
        <Button>
          <i className="fas fa-step-forward"></i>
        </Button>
        <div className="Duration">
          <span>{convertTime(currentTime)}</span>
          <input type="range" className="form-range mt-3 w-50" />
          <span>{convertTime(duration)}</span>
        </div>
      </div>
      <div className="Volume m-2">
        <input
          type="range"
          min="0"
          step="1"
          max="100"
          className="form-range"
          onChange={(e) => {
            setVol(e.target.value);
            volumeAudio(vol);
          }}
          value={vol}
        />
      </div>
    </div>
  );
};

export const CAudioController = connect((state) => ({ player: state.player }), {
  playAudio: actionPlayAudio,
  pauseAudio: actionPauseAudio,
  volumeAudio: actionVolumeAudio,
})(AudioController);
