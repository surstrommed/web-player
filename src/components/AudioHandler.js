import { takeEvery, put, select } from "redux-saga/effects";
import { store } from "../App";
import { backURL } from "./../helpers/index";

const audio = new Audio();

window.onload = () => {
  let { player } = store.getState();
  if (player?.isPlaying) {
    store.dispatch(actionFullPauseAudio(true));
  }
};

function* audioLoadWorker({ track, playlist, indexInPlaylist }) {
  console.log("Load track");
  let { player } = yield select();
  if (player?.indexInPlaylist !== indexInPlaylist) {
    yield put(actionLoadAudio(track, playlist, indexInPlaylist));
    audio.src = `${backURL}/${track?.url}`;
    yield put(actionFullPlayAudio(true));
  } else {
    if (player?.isPlaying) {
      yield put(actionFullPauseAudio(true));
    }
    if (player?.isPaused) {
      audio.src = `${backURL}/${player?.track?.url}`;
      audio.currentTime = player?.currentTime;
      yield put(actionFullPlayAudio(true));
    }
  }
  audio.onloadedmetadata = () => {
    store.dispatch(actionFullSetDuration(Math.trunc(audio.duration)));
  };
}

export function* audioLoadWatcher() {
  yield takeEvery("FULL_LOAD_TRACK", audioLoadWorker);
}

function* audioPlayWorker(isPlaying) {
  console.log("Play track");
  audio.play();
  audio.ontimeupdate = (e) => {
    store.dispatch(actionFullSetCurrentTimeTrack(e.path[0].currentTime));
  };
  yield put(actionPlayAudio(isPlaying));
}

export function* audioPlayWatcher() {
  yield takeEvery("FULL_PLAY_TRACK", audioPlayWorker);
}

function* audioPauseWorker(isPaused) {
  console.log("Pause track");
  audio.pause();
  yield put(actionPauseAudio(isPaused));
}

export function* audioPauseWatcher() {
  yield takeEvery("FULL_PAUSE_TRACK", audioPauseWorker);
}

function* audioPrevTrackWorker({ indexInPlaylist }) {
  console.log("Prev track");
  let { player } = yield select();
  if (player?.playlist[indexInPlaylist - 1]) {
    indexInPlaylist -= 1;
  } else {
    indexInPlaylist = player?.playlist?.length - 1;
  }
  yield put(actionFullPauseAudio(true));
  audio.currentTime = 0;
  yield put(
    actionFullLoadAudio(
      player?.playlist[indexInPlaylist],
      player?.playlist,
      indexInPlaylist
    )
  );
}

export function* audioPrevTrackWatcher() {
  yield takeEvery("PREV_TRACK", audioPrevTrackWorker);
}

function* audioNextTrackWorker({ indexInPlaylist }) {
  console.log("Next track");
  let { player } = yield select();
  if (player?.playlist[indexInPlaylist + 1]) {
    console.log("true");
    indexInPlaylist += 1;
  } else {
    indexInPlaylist = 0;
  }
  yield put(actionFullPauseAudio(true));
  audio.currentTime = 0;
  yield put(
    actionFullLoadAudio(
      player?.playlist[indexInPlaylist],
      player?.playlist,
      indexInPlaylist
    )
  );
}

export function* audioNextTrackWatcher() {
  yield takeEvery("NEXT_TRACK", audioNextTrackWorker);
}

function* audioSetCurrentTimeWorker({ currentTime }) {
  console.log("Set current time track");
  yield put(actionSetCurrentTimeTrack(currentTime));
}

export function* audioSetCurrentTimeWatcher() {
  yield takeEvery("FULL_SET_CURRENT_TIME_TRACK", audioSetCurrentTimeWorker);
}

function* audioSetSeekTimeTrackWorker({ seekTime }) {
  console.log("Set seek time track");
  audio.currentTime = seekTime;
  yield put(actionSetSeekTimeTrack(seekTime));
}

export function* audioSetSeekTimeTrackWatcher() {
  yield takeEvery("FULL_SET_SEEK_TIME_TRACK", audioSetSeekTimeTrackWorker);
}

function* audioSetVolumeWorker({ volume }) {
  console.log("Set volume");
  audio.volume = volume;
  yield put(actionSetVolume(volume));
}

export function* audioSetVolumeWatcher() {
  yield takeEvery("FULL_SET_VOLUME", audioSetVolumeWorker);
}

function* audioSetDurationWorker({ duration }) {
  console.log("Set duration");
  yield put(actionSetDuration(duration));
}

export function* audioSetDurationWatcher() {
  yield takeEvery("FULL_SET_DURATION", audioSetDurationWorker);
}

export const actionLoadAudio = (track, playlist, indexInPlaylist) => ({
  type: "LOAD_TRACK",
  track,
  playlist,
  indexInPlaylist,
});

export const actionFullLoadAudio = (track, playlist, indexInPlaylist) => ({
  type: "FULL_LOAD_TRACK",
  track,
  playlist,
  indexInPlaylist,
});

export const actionPlayAudio = ({ isPlaying }) => ({
  type: "PLAY_TRACK",
  isPlaying,
});

export const actionFullPlayAudio = (isPlaying) => ({
  type: "FULL_PLAY_TRACK",
  isPlaying,
});

export const actionPauseAudio = ({ isPaused }) => ({
  type: "PAUSE_TRACK",
  isPaused,
});

export const actionFullPauseAudio = (isPaused) => ({
  type: "FULL_PAUSE_TRACK",
  isPaused,
});

export const actionPrevTrack = (indexInPlaylist) => ({
  type: "PREV_TRACK",
  indexInPlaylist,
});

export const actionNextTrack = (indexInPlaylist) => ({
  type: "NEXT_TRACK",
  indexInPlaylist,
});

export const actionSetCurrentTimeTrack = (currentTime) => ({
  type: "SET_CURRENT_TIME_TRACK",
  currentTime,
});

export const actionFullSetCurrentTimeTrack = (currentTime) => ({
  type: "FULL_SET_CURRENT_TIME_TRACK",
  currentTime,
});

export const actionSetSeekTimeTrack = (seekTime) => ({
  type: "SET_SEEK_TIME_TRACK",
  currentTime: seekTime,
});

export const actionFullSetSeekTimeTrack = (seekTime) => ({
  type: "FULL_SET_SEEK_TIME_TRACK",
  seekTime,
});

export const actionSetVolume = (volume) => ({
  type: "SET_VOLUME",
  volume,
});

export const actionFullSetVolume = (volume) => ({
  type: "FULL_SET_VOLUME",
  volume,
});

export const actionSetDuration = (duration) => ({
  type: "SET_DURATION",
  duration,
});

export const actionFullSetDuration = (duration) => ({
  type: "FULL_SET_DURATION",
  duration,
});
