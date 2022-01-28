import { put, takeEvery, select, call } from "redux-saga/effects";
import { gql, delay, queries } from "./../helpers/index";
import {
  actionAboutMe,
  actionTracksToPlaylist,
  actionFindUserPlaylists,
  actionSearchResult,
  actionAuthLogin,
  actionFullLoadNewTracks,
  actionClearTracks,
  actionSkipTracks,
  actionLoadNewTracks,
  actionPromise,
  actionPending,
  actionRejected,
  actionResolved,
  actionPlaylistTracks,
} from "./types";
import {
  actionUploadFile,
  actionLoadTracksToPlaylist,
  actionFindPlaylistTracks,
  actionUserTracks,
  actionCreatePlaylist,
  actionUserPlaylists,
  actionChangePassword,
  actionUserUpdate,
  actionLogin,
  actionRegister,
  actionFindTracks,
  actionFindUser,
} from "./index";

function* promiseWorker(action) {
  const { name, promise } = action;
  yield put(actionPending(name));
  try {
    let data = yield promise;
    yield put(actionResolved(name, data));
    return data;
  } catch (error) {
    yield put(actionRejected(name, error));
  }
}

export function* promiseWatcher() {
  yield takeEvery("PROMISE_START", promiseWorker);
}

function* aboutMeWorker() {
  let { auth } = yield select();
  if (auth) {
    let { id } = auth?.payload?.sub;
    yield call(promiseWorker, actionFindUser(id));
  }
}

export function* aboutMeWatcher() {
  yield takeEvery("ABOUT_ME", aboutMeWorker);
}

function* routeWorker({ match }) {
  console.log(match);
  if (match.path in queries) {
    const { name, query, variables } = queries[match.path](match);
    yield call(promiseWorker, actionPromise(name, gql(query, variables)));
  }
}

export function* routeWatcher() {
  yield takeEvery("ROUTE", routeWorker);
}

function* loginWorker({ login, password }) {
  let token = yield call(promiseWorker, actionLogin(login, password));
  if (token) {
    yield put(actionAuthLogin(token));
    yield put(actionAboutMe());
  }
  window.location.reload();
}

export function* loginWatcher() {
  yield takeEvery("FULL_LOGIN", loginWorker);
}

function* loadNewTracksWorker({ newTracks }) {
  yield put(actionLoadNewTracks(newTracks));
}

export function* loadNewTracksWatcher() {
  yield takeEvery("FULL_ADD_TRACKS", loadNewTracksWorker);
}

function* addSkipTracksWorker({ skipTracks }) {
  yield put(actionSkipTracks(skipTracks));
}

export function* addSkipTracksWatcher() {
  yield takeEvery("FULL_ADD_SKIP", addSkipTracksWorker);
}

function* clearSkipTracksWorker() {
  yield put(actionClearTracks());
}

export function* clearSkipTracksWatcher() {
  yield takeEvery("FULL_CLEAR_SKIP", clearSkipTracksWorker);
}

function* findTracksWorker({ skip }) {
  let newTracks = yield call(promiseWorker, actionFindTracks(skip));
  if (newTracks) {
    yield put(actionFullLoadNewTracks(newTracks));
  }
}

export function* findTracksWatcher() {
  yield takeEvery("FIND_ALL_TRACKS", findTracksWorker);
}

function* registerWorker({ login, password }) {
  yield call(promiseWorker, actionRegister(login, password));
  let token = yield call(promiseWorker, actionLogin(login, password));
  if (token) {
    yield put(actionAuthLogin(token));
    let { auth } = yield select();
    let nick = login;
    if (nick.includes("@")) {
      nick = nick.substring(0, nick.indexOf("@"));
      if (nick.length > 8) {
        nick = nick.substring(0, 8);
      }
    }
    let { id } = auth?.payload?.sub;
    yield call(promiseWorker, actionUserUpdate({ _id: id, nick }));
    yield put(actionAboutMe());
  }
}

export function* registerWatcher() {
  yield takeEvery("FULL_REGISTER", registerWorker);
}

function* setAvatarWorker({ file }) {
  let { _id } = yield call(promiseWorker, actionUploadFile(file));
  let { auth } = yield select();
  if (auth) {
    let { id } = auth?.payload?.sub;
    yield call(promiseWorker, actionUserUpdate({ _id: id, avatar: { _id } }));
    yield put(actionAboutMe());
  }
}

export function* setAvatarWatcher() {
  yield takeEvery("SET_AVATAR", setAvatarWorker);
}

function* setNicknameWorker({ _id, nick }) {
  yield call(promiseWorker, actionUserUpdate({ _id, nick }));
  yield put(actionAboutMe());
}

export function* setNicknameWatcher() {
  yield takeEvery("SET_NICKNAME", setNicknameWorker);
}

function* setEmailWorker({ _id, login }) {
  yield call(promiseWorker, actionUserUpdate({ _id, login }));
  yield put(actionAboutMe());
}

export function* setEmailWatcher() {
  yield takeEvery("SET_EMAIL", setEmailWorker);
}

function* setNewPasswordWorker({ login, password, newPassword }) {
  yield call(promiseWorker, actionChangePassword(login, password, newPassword));
  yield put(actionAboutMe());
}

export function* setNewPasswordWatcher() {
  yield takeEvery("SET_NEW_PASSWORD", setNewPasswordWorker);
}

function* searchWorker({ text }) {
  yield put(actionSearchResult({ payload: null }));
  yield delay(2000);
  let payload = yield gql(
    `
          query searchTracks($query: String){
            TrackFind(query: $query) {
              _id url originalFileName
              id3 {
                  title, artist
              }
              playlists {
                  _id, name
              }
              owner {
                _id login nick
              }
          }
          }`,
    {
      query: JSON.stringify([
        {
          $or: [{ originalFileName: `/${text}/` }],
        },
        {
          sort: [{ name: 1 }],
        },
      ]),
    }
  );
  yield put(actionSearchResult({ payload }));
}

export function* searchWatcher() {
  yield takeEvery("SEARCH", searchWorker);
}

function* findPlaylistByOwnerWorker() {
  let { auth } = yield select();
  if (auth) {
    let { id } = auth?.payload?.sub;
    yield call(promiseWorker, actionUserPlaylists(id));
  }
}

export function* findPlaylistByOwnerWatcher() {
  yield takeEvery("FIND_PLAYLISTS", findPlaylistByOwnerWorker);
}

function* createPlaylistWorker({ name }) {
  let { auth } = yield select();
  if (auth) {
    yield call(promiseWorker, actionCreatePlaylist(name));
    yield put(actionFindUserPlaylists());
  }
}

export function* createPlaylistWatcher() {
  yield takeEvery("CREATE_PLAYLIST", createPlaylistWorker);
}

function* findUserTracksWorker({ _id }) {
  yield call(promiseWorker, actionUserTracks(_id));
}

export function* findUserTracksWatcher() {
  yield takeEvery("FIND_USER_TRACKS", findUserTracksWorker);
}

function* findPlaylistTracksWorker({ _id }) {
  yield call(promiseWorker, actionFindPlaylistTracks(_id));
}

export function* findPlaylistTracksWatcher() {
  yield takeEvery("PLAYLIST_TRACKS", findPlaylistTracksWorker);
}

function* loadTracksToPlaylistWorker({ idPlaylist, array }) {
  yield call(promiseWorker, actionLoadTracksToPlaylist(idPlaylist, array));
  yield put(actionPlaylistTracks(idPlaylist));
}

export function* loadTracksToPlaylistWatcher() {
  yield takeEvery("LOAD_TRACKS_PLAYLIST", loadTracksToPlaylistWorker);
}

const uploadedTracks = [];

function* uploadTracksToPlaylistWorker({ file }) {
  const currentTracksPlaylist = [];
  let resultArray = [];
  let { route } = yield select();
  let idPlaylist = route?.params?._id;
  let { promise } = yield select();
  if (promise?.playlistTracks?.payload?.tracks) {
    promise?.playlistTracks?.payload?.tracks.map((playlistTrack) =>
      currentTracksPlaylist.push(playlistTrack)
    );
  }
  if (file) {
    let track = yield call(promiseWorker, actionUploadFile(file, "track"));
    uploadedTracks.push(track);
    let allUploadTracks = [...currentTracksPlaylist, ...uploadedTracks];
    allUploadTracks.map((uploadedTrack) =>
      resultArray.push({ _id: uploadedTrack?._id })
    );
    yield put(actionTracksToPlaylist(idPlaylist, resultArray));
  }
}

export function* uploadTracksToPlaylistWatcher() {
  yield takeEvery("UPLOAD_TRACKS", uploadTracksToPlaylistWorker);
}
