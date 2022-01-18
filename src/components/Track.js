import { Button } from "react-bootstrap";
import { connect } from "react-redux";
import { backURL } from "../helpers/index";
import { useState } from "react";
import { CAudioController } from "./AudioController";

import {
  actionPauseAudio,
  actionPlayAudio,
  actionVolumeAudio,
  actionLoadAudio,
} from "./../actions/index";

const Track = ({
  audio,
  index,
  loadAudio,
  playAudio,
  pauseAudio,
  volumeAudio,
  player,
  promise,
}) => {
  const [reproduction, setReproduction] = useState(false);
  let track = audio?.url ? `${backURL}/${audio.url}` : undefined;
  let audioTrack = new Audio(track);
  let duration, currentTime, volume;
  audioTrack.addEventListener("loadeddata", () => {
    duration = audioTrack.duration;
    currentTime = audioTrack.currentTime;
    volume = audioTrack.volume;
  });

  if (reproduction) {
    audioTrack.play();
  } else {
    audioTrack.pause();
  }

  function truncText(text) {
    if (text && text.length > 40) {
      return text.substring(0, 40) + "...";
    } else return text;
  }

  return (
    <>
      <div className="d-flex mt-5">
        <div className="customAudio p-2 bg-dark text-white">
          <span className="ml-3 d-inline-block">
            {index + 1} |{" "}
            <span>
              {audio?.originalFileName
                ? truncText(audio.originalFileName)
                : "Без названия"}
            </span>
          </span>
        </div>
        <Button
          onClick={() => {
            setReproduction(!reproduction);
            reproduction ? pauseAudio(true) : playAudio(true);
          }}
        >
          <i
            className={`fas ${
              reproduction ? "fa-pause-circle" : "fa-play-circle"
            }`}
          ></i>
        </Button>
        <Button>
          <i className="fas fa-plus"></i>
        </Button>
      </div>
      <CAudioController
        name={audio?.originalFileName}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
      />
    </>
  );
};

// <div>{promise?.tracks?.}</div>

export const CTrack = connect(
  (state) => ({ promise: state.promise, player: state.player }),
  {
    loadAudio: actionLoadAudio,
    playAudio: actionPlayAudio,
    pauseAudio: actionPauseAudio,
    volumeAudio: actionVolumeAudio,
  }
)(Track);
