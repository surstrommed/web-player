import { Button } from "react-bootstrap";
import { connect } from "react-redux";
import { backURL } from "../helpers/index";
import { useState, useEffect, useRef } from "react";

export const Track = ({ audio, index }) => {
  const [reproduction, setReproduction] = useState(false);
  let track = audio?.url ? `${backURL}/${audio.url}` : undefined;
  let trackRef = useRef(new Audio(track));

  useEffect(() => {
    reproduction ? trackRef.current.play() : trackRef.current.pause();
  }, [reproduction]);

  function truncText(text) {
    if (text.length > 40) {
      return text.substring(0, 40) + "...";
    } else return text;
  }

  return (
    <div className="d-flex mt-5">
      <div className="customAudio p-2 bg-dark text-white">
        <span className="ml-3 d-inline-block">
          {index + 1} |{" "}
          <span>
            {audio?.originalFileName
              ? truncText(audio.originalFileName)
              : undefined}
          </span>
        </span>
      </div>
      <Button onClick={() => setReproduction(!reproduction)}>
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
  );
};

export const CAudio = connect(
  (state) => ({ auth: state.auth, promise: state.promise }),
  null
)(Audio);
