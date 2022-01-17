import { Button } from "react-bootstrap";
import { connect } from "react-redux";
import { backURL } from "../helpers/index";
import { useState, useEffect, useRef } from "react";
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
}) => {
  const [reproduction, setReproduction] = useState(false);
  let track = audio?.url ? `${backURL}/${audio.url}` : undefined;
  let trackRef = useRef(new Audio(track));

  useEffect(() => {
    if (reproduction) {
      trackRef.current.play();
    } else {
      trackRef.current.pause();
    }
  }, [reproduction, playAudio, pauseAudio]);

  function truncText(text) {
    if (text && text.length > 40) {
      return text.substring(0, 40) + "...";
    } else return text;
  }

  return (
    <>
      {reproduction ? (
        <CAudioController
          name={audio?.originalFileName}
          currentTime={trackRef.current.currentTime}
          duration={player.duration}
          volume={trackRef.current.volume}
        />
      ) : null}
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
            loadAudio(trackRef.current, trackRef.current.duration);
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
    </>
  );
};

export const CTrack = connect((state) => ({ player: state.player }), {
  loadAudio: actionLoadAudio,
  playAudio: actionPlayAudio,
  pauseAudio: actionPauseAudio,
  volumeAudio: actionVolumeAudio,
})(Track);
