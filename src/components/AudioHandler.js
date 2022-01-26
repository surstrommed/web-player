import { takeEvery, put, select } from "redux-saga/effects";
import { store } from "../App";
import { backURL } from "./../helpers/index";

const audio = new Audio();

function* audioLoadWorker({ track, playlist, indexInPlaylist }) {
  console.log("Load track");
  let { player } = yield select();
  if (player?.indexInPlaylist !== indexInPlaylist) {
    yield put(actionLoadAudio(track, playlist, indexInPlaylist));
    audio.src = `${backURL}/${player?.track?.url}`;
  }
  if (player?.indexInPlaylist === indexInPlaylist) {
    if (player?.isPlaying) {
      yield put(actionFullPauseAudio(true));
    }
    if (player?.isPaused) {
      yield put(actionFullPlayAudio(true));
    }
  }
  audio.onloadedmetadata = (e) => {
    store.dispatch(actionFullSetDuration(Math.trunc(audio.duration)));
  };
  audio.ontimeupdate = (e) => {
    store.dispatch(
      actionFullSetCurrentTimeTrack(Math.trunc(e.timeStamp / 1000))
    );
  };
}

export function* audioLoadWatcher() {
  yield takeEvery("FULL_LOAD_TRACK", audioLoadWorker);
}

function* audioPlayWorker(isPlaying) {
  console.log("Play track");
  audio.play();
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

function* audioPrevTrackWorker(track, indexInPlaylist) {
  console.log("Prev track");
  yield put(actionPrevTrack(track, indexInPlaylist));
}

export function* audioPrevTrackWatcher() {
  yield takeEvery("FULL_PREV_TRACK", audioPrevTrackWorker);
}

function* audioNextTrackWorker(track, indexInPlaylist) {
  console.log("Next track");
  yield put(actionNextTrack(track, indexInPlaylist));
}

export function* audioNextTrackWatcher() {
  yield takeEvery("FULL_NEXT_TRACK", audioNextTrackWorker);
}

function* audioSetCurrentTimeWorker({ currentTime }) {
  console.log("Set current time track");
  // audio.currentTime = currentTime;
  yield put(actionSetCurrentTimeTrack(currentTime));
}

export function* audioSetCurrentTimeWatcher() {
  yield takeEvery("FULL_SET_CURRENT_TIME_TRACK", audioSetCurrentTimeWorker);
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
  // audio.duration = duration;
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

export const actionPrevTrack = ({ indexInPlaylist, track }) => ({
  type: "PREV_TRACK",
  indexInPlaylist,
  track,
});

export const actionFullPrevTrack = (indexInPlaylist, track) => ({
  type: "FULL_PREV_TRACK",
  indexInPlaylist,
  track,
});

export const actionNextTrack = ({ indexInPlaylist, track }) => ({
  type: "NEXT_TRACK",
  indexInPlaylist,
  track,
});

export const actionFullNextTrack = (indexInPlaylist, track) => ({
  type: "FULL_NEXT_TRACK",
  indexInPlaylist,
  track,
});

export const actionSetCurrentTimeTrack = ({ currentTime }) => ({
  type: "SET_CURRENT_TIME_TRACK",
  currentTime,
});

export const actionFullSetCurrentTimeTrack = (currentTime) => ({
  type: "FULL_SET_CURRENT_TIME_TRACK",
  currentTime,
});

export const actionSetVolume = ({ volume }) => ({
  type: "SET_VOLUME",
  volume,
});

export const actionFullSetVolume = (volume) => ({
  type: "FULL_SET_VOLUME",
  volume,
});

export const actionSetDuration = ({ duration }) => ({
  type: "SET_DURATION",
  duration,
});

export const actionFullSetDuration = (duration) => ({
  type: "FULL_SET_DURATION",
  duration,
});
