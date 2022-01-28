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

export const actionPending = (name) => ({
  type: "PROMISE",
  status: "PENDING",
  name,
});

export const actionResolved = (name, payload) => ({
  type: "PROMISE",
  status: "RESOLVED",
  name,
  payload,
});

export const actionRejected = (name, error) => ({
  type: "PROMISE",
  status: "REJECTED",
  name,
  error,
});

export const actionAuthLogin = (token) => ({ type: "AUTH_LOGIN", token });

export const actionAuthLogout = () => ({ type: "AUTH_LOGOUT" });

export const actionPromise = (name, promise) => ({
  type: "PROMISE_START",
  name,
  promise,
});

export const actionAboutMe = () => ({
  type: "ABOUT_ME",
});

export const actionFullLogin = (login, password) => ({
  type: "FULL_LOGIN",
  login,
  password,
});

export const actionFullRegister = (login, password) => ({
  type: "FULL_REGISTER",
  login,
  password,
});

export const actionSetAvatar = (file) => ({
  type: "SET_AVATAR",
  file,
});

export const actionSetNickname = ({ _id, nick }) => ({
  type: "SET_NICKNAME",
  _id,
  nick,
});

export const actionSetEmail = ({ _id, login }) => ({
  type: "SET_EMAIL",
  _id,
  login,
});

export const actionSetNewPassword = (login, password, newPassword) => ({
  type: "SET_NEW_PASSWORD",
  login,
  password,
  newPassword,
});

export const actionSearch = (text) => ({ type: "SEARCH", text });

export const actionSearchResult = (payload) => ({
  type: "SEARCH_RESULT",
  payload,
});

export const actionSetSearch = (action) => ({ type: "SET_SEARCH", action });

export const actionLoadNewTracks = (newTracks) => ({
  type: "ADD_TRACKS",
  newTracks,
});

export const actionFullLoadNewTracks = (newTracks) => ({
  type: "FULL_ADD_TRACKS",
  newTracks,
});

export const actionSkipTracks = (skipTracks) => ({
  type: "ADD_SKIP",
  skipTracks,
});

export const actionFullSkipTracks = (skipTracks) => ({
  type: "FULL_ADD_SKIP",
  skipTracks,
});

export const actionClearTracks = () => ({
  type: "CLEAR_SKIP",
});

export const actionFullClearTracks = () => ({
  type: "FULL_CLEAR_SKIP",
});

export const actionAllTracks = (skip) => ({
  type: "FIND_ALL_TRACKS",
  skip,
});

export const actionTracksUser = (_id) => ({
  type: "FIND_USER_TRACKS",
  _id,
});

export const actionFindUserPlaylists = () => ({ type: "FIND_PLAYLISTS" });

export const actionCreateNewPlaylist = (name) => ({
  type: "CREATE_PLAYLIST",
  name,
});

export const actionPlaylistTracks = (_id) => ({
  type: "PLAYLIST_TRACKS",
  _id,
});

export const actionTracksToPlaylist = (idPlaylist, array) => ({
  type: "LOAD_TRACKS_PLAYLIST",
  idPlaylist,
  array,
});

export const actionUploadTracks = (file) => ({
  type: "UPLOAD_TRACKS",
  file,
});
