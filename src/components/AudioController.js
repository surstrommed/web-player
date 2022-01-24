import { Button } from "react-bootstrap";
import { connect } from "react-redux";
import { useState } from "react";
import * as actions from "../actions";
import { backURL } from "../helpers";

let audio = new Audio();

const AudioController = ({
  promise,
  player,
  playAudio,
  pauseAudio,
  prevAudio,
  nextAudio,
  setDuration,
  setVolume,
  setCurrentTime,
}) => {
  const [vol, setVol] = useState(player?.volume ? +player?.volume : 50);
  const [dur, setDur] = useState(player?.duration ? player?.duration : 0);
  const [pos, setPos] = useState(player?.currentTime ? player?.currentTime : 0);
  const [indexInPlaylist, setIndexInPlaylist] = useState(
    player?.indexInPlaylist
  );

  let audioInPlaylist = player?.playlist[player?.indexInPlaylist];
  audio.src = `${backURL}/${audioInPlaylist?.url}`;

  audio.onloadedmetadata = () => {
    setDur(audio.duration);
  };

  audio.ondurationchange = () => {
    // setDuration(dur);
  };

  audio.ontimeupdate = (event) => {
    // console.log(audio.currentTime);
  };

  const checkIndexInPlaylist = (type) => {
    if (type === "prev") {
      if (player?.playlist[indexInPlaylist - 1]) {
        setIndexInPlaylist(indexInPlaylist - 1);
        return indexInPlaylist;
      } else {
        setIndexInPlaylist(player?.playlist?.length - 1);
        return indexInPlaylist;
      }
    }
    if (type === "next") {
      if (player?.playlist[indexInPlaylist + 1]) {
        setIndexInPlaylist(indexInPlaylist + 1);
        return indexInPlaylist;
      } else {
        setIndexInPlaylist(0);
        return indexInPlaylist;
      }
    }
  };

  const checkTrackInPlaylist = () => {};

  const audioPlayPause = () => {
    if (player?.isPlaying) {
      // audio.pause();
      pauseAudio(true);
    }
    if (player?.isPaused) {
      // audio.play();
      playAudio(true);
    }
  };

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
        {truncText(player?.track?.originalFileName)}
      </span>
      <div className="Buttons m-2">
        <Button
          className="mr-2"
          onClick={() => {
            checkIndexInPlaylist("prev");
            console.log(indexInPlaylist, player?.playlist[indexInPlaylist]);
            prevAudio(indexInPlaylist, player?.playlist[indexInPlaylist]);
          }}
        >
          <i className="fas fa-step-backward"></i>
        </Button>
        <Button className="mr-2" onClick={() => audioPlayPause()}>
          <i
            className={`fas fa-${player?.isPlaying ? "pause" : "caret-right"}`}
          ></i>
        </Button>
        <Button
          onClick={() => {
            checkIndexInPlaylist("next");
            console.log(indexInPlaylist, player?.playlist[indexInPlaylist]);
            nextAudio(indexInPlaylist, player?.playlist[indexInPlaylist]);
          }}
        >
          <i className="fas fa-step-forward"></i>
        </Button>
        <div className="Duration">
          <span>{convertTime(player?.currentTime)}</span>
          <input
            type="range"
            className="form-range mt-3 w-50"
            min={0}
            max={
              !player?.duration || Number.isNaN(player?.duration)
                ? 0
                : Math.trunc(player?.duration)
            }
            value={pos}
            step={1}
            onChange={(e) => {
              setPos(e.target.value);
              setCurrentTime(+pos);
            }}
          />
          <span>{convertTime(dur)}</span>
        </div>
      </div>
      <div className="Volume m-2">
        <input
          type="range"
          className="form-range"
          min={0}
          step={1}
          max={100}
          value={vol}
          onChange={(e) => {
            setVol(e.target.value);
            setVolume(+vol);
          }}
        />
      </div>
    </div>
  );
};

export const CAudioController = connect(
  (state) => ({ promise: state.promise, player: state.player }),
  {
    playAudio: actions.actionFullPlayAudio,
    pauseAudio: actions.actionFullPauseAudio,
    nextAudio: actions.actionFullNextTrack,
    prevAudio: actions.actionFullPrevTrack,
    setVolume: actions.actionFullSetVolume,
    setDuration: actions.actionFullSetDuration,
    setCurrentTime: actions.actionFullSetCurrentTimeTrack,
  }
)(AudioController);
