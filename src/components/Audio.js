import { takeEvery, put } from "redux-saga/effects";
import { Button } from "react-bootstrap";
import * as actions from "../actions";
import { connect } from "react-redux";
import { backURL } from "../helpers/index";
import { Link } from "react-router-dom";
import { useState } from "react";

function* audioLoadWorker(track, playlist, indexInPlaylist) {
  console.log("Load track");
  yield put(actions.actionLoadAudio(track, playlist, indexInPlaylist));
}

export function* audioLoadWatcher() {
  yield takeEvery("FULL_LOAD_TRACK", audioLoadWorker);
}

function* audioPlayWorker(isPlaying) {
  console.log("Play track");
  yield put(actions.actionPlayAudio(isPlaying));
}

export function* audioPlayWatcher() {
  yield takeEvery("FULL_PLAY_TRACK", audioPlayWorker);
}

function* audioPauseWorker(isPaused) {
  console.log("Pause track");
  yield put(actions.actionPauseAudio(isPaused));
}

export function* audioPauseWatcher() {
  yield takeEvery("FULL_PAUSE_TRACK", audioPauseWorker);
}

function* audioPrevTrackWorker(track, indexInPlaylist) {
  console.log("Prev track");
  yield put(actions.actionPrevTrack(track, indexInPlaylist));
}

export function* audioPrevTrackWatcher() {
  yield takeEvery("FULL_PREV_TRACK", audioPrevTrackWorker);
}

function* audioNextTrackWorker(track, indexInPlaylist) {
  console.log("Next track");
  yield put(actions.actionNextTrack(track, indexInPlaylist));
}

export function* audioNextTrackWatcher() {
  yield takeEvery("FULL_NEXT_TRACK", audioNextTrackWorker);
}

function* audioSetCurrentTimeWorker(currentTime) {
  console.log("Set current time track");
  yield put(actions.actionSetCurrentTimeTrack(currentTime));
}

export function* audioSetCurrentTimeWatcher() {
  yield takeEvery("FULL_SET_CURRENT_TIME_TRACK", audioSetCurrentTimeWorker);
}

function* audioSetVolumeWorker(volume) {
  console.log("Set volume");
  yield put(actions.actionSetVolume(volume));
}

export function* audioSetVolumeWatcher() {
  yield takeEvery("FULL_SET_VOLUME", audioSetVolumeWorker);
}

function* audioSetDurationWorker(duration) {
  console.log("Set duration");
  yield put(actions.actionSetDuration(duration));
}

export function* audioSetDurationWatcher() {
  yield takeEvery("FULL_SET_DURATION", audioSetDurationWorker);
}

let audio = new Audio();

const AudioTrack = ({
  personal,
  player,
  track,
  index,
  playlist,
  loadAudio,
  playAudio,
  pauseAudio,
}) => {
  const [play, setPlay] = useState(player?.isPlaying);

  audio.src = `${backURL}/${track?.url}`;

  function truncText(text) {
    if (text && text.length > 40) {
      return text.substring(0, 40) + "...";
    } else return text;
  }

  let audioPlayPause = (track, playlist) => {
    let indexInPlaylist = playlist.findIndex(
      (trackPlaylist) => trackPlaylist?._id === track?._id
    );

    loadAudio(track, playlist, indexInPlaylist);
    if (player?.isPaused) {
      audio.play();
      setPlay(true);
      playAudio(true);
    }
    if (player?.isPlaying) {
      audio.pause();
      setPlay(false);
      pauseAudio(true);
    }
  };

  return (
    <div className="d-flex mt-5">
      <div className="customAudio p-2 bg-dark text-white">
        <span className="ml-3 d-inline-block">
          {index + 1} |{" "}
          <span>
            {track?.originalFileName
              ? truncText(track.originalFileName)
              : "Без названия"}
          </span>
        </span>
      </div>
      <Button onClick={() => audioPlayPause(track, playlist)}>
        <i className={`fas ${play ? "fa-pause-circle" : "fa-play-circle"}`}></i>
      </Button>
      <a
        className="btn btn-primary h-50 ml-1 my-auto"
        href={`${backURL}/${track?.url}`}
        role="button"
      >
        <i className="fas fa-download"></i>
      </a>
      <span>{track?.duration}</span>
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
  playAudio: actions.actionFullPlayAudio,
  pauseAudio: actions.actionFullPauseAudio,
  loadAudio: actions.actionFullLoadAudio,
})(AudioTrack);
