import { Main } from "./components/Main";
import { Header } from "./components/Header";
import { Router } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { createBrowserHistory } from "history";
import {
  promiseReducer,
  authReducer,
  localStoredReducer,
  searchReducer,
  playerReducer,
  routeReducer,
} from "./reducers/index";
import { Sidebar } from "./components/Sidebar";
import "./App.scss";
import createSagaMiddleware from "redux-saga";
import {
  all,
  takeEvery,
  takeLatest,
  put,
  call,
  select,
} from "redux-saga/effects";
import * as actions from "./actions";
import { delay, gql } from "./helpers";
import { CAudioController } from "./components/AudioController";
import {
  audioLoadWatcher,
  audioPlayWatcher,
  audioPauseWatcher,
  audioPrevTrackWatcher,
  audioNextTrackWatcher,
  audioSetDurationWatcher,
  audioSetVolumeWatcher,
  audioSetCurrentTimeWatcher,
} from "./components/Audio";
export const history = createBrowserHistory();

const sagaMiddleware = createSagaMiddleware();

export const store = createStore(
  combineReducers({
    promise: localStoredReducer(promiseReducer, "promise"),
    auth: localStoredReducer(authReducer, "auth"),
    player: localStoredReducer(playerReducer, "player"),
    route: localStoredReducer(routeReducer, "route"),
    search: searchReducer,
    // изменить условия на страницах на отображения по роутам
  }),
  applyMiddleware(sagaMiddleware)
);

function* rootSaga() {
  yield all([
    promiseWatcher(),
    aboutAnotherUserWatcher(),
    aboutMeWatcher(),
    routeWatcher(),
    loginWatcher(),
    registerWatcher(),
    findTracksWatcher(),
    findUserTracksWatcher(),
    setAvatarWatcher(),
    setNicknameWatcher(),
    setEmailWatcher(),
    setNewPasswordWatcher(),
    searchWatcher(),
    audioPlayWatcher(),
    audioPauseWatcher(),
    audioPrevTrackWatcher(),
    audioNextTrackWatcher(),
    audioSetCurrentTimeWatcher(),
    audioSetVolumeWatcher(),
    audioLoadWatcher(),
    audioSetDurationWatcher(),
    findPlaylistByOwnerWatcher(),
    createPlaylistWatcher(),
    findPlaylistTracksWatcher(),
    loadTracksToPlaylistWatcher(),
    uploadTracksToPlaylistWatcher(),
  ]);
}

sagaMiddleware.run(rootSaga);

function* promiseWorker(action) {
  const { name, promise } = action;
  yield put(actions.actionPending(name));
  try {
    let data = yield promise;
    yield put(actions.actionResolved(name, data));
    return data;
  } catch (error) {
    yield put(actions.actionRejected(name, error));
  }
}

function* promiseWatcher() {
  yield takeEvery("PROMISE_START", promiseWorker);
}

function* aboutMeWorker() {
  // let { id } = getState().auth.payload.sub;
  // await dispatch(actionFindUser(id));
  let { auth } = yield select();
  if (auth) {
    let { id } = auth?.payload?.sub;
    yield call(promiseWorker, actions.actionFindUser(id));
  }
}

function* aboutMeWatcher() {
  yield takeEvery("ABOUT_ME", aboutMeWorker);
}

function* aboutAnotherUserWorker({ id }) {
  yield call(promiseWorker, actions.actionFindUser(id, "anotherUser"));
}

function* aboutAnotherUserWatcher() {
  yield takeEvery("ABOUT_ANOTHER_USER", aboutAnotherUserWorker);
}

if (localStorage.authToken) {
  store.dispatch(actions.actionAboutMe());
}

const queries = {};

function* routeWorker({ match }) {
  console.log(match);
  if (match.path in queries) {
    const { name, query, variables } = queries[match.path](match);
    yield call(
      promiseWorker,
      actions.actionPromise(name, gql(query, variables))
    );
  }
}

function* routeWatcher() {
  yield takeEvery("ROUTE", routeWorker);
}

function* loginWorker({ login, password }) {
  let token = yield call(promiseWorker, actions.actionLogin(login, password));
  if (token) {
    yield put(actions.actionAuthLogin(token));
    yield put(actions.actionAboutMe());
  }
}

function* loginWatcher() {
  yield takeEvery("FULL_LOGIN", loginWorker);
}

function* registerWorker({ login, password }) {
  yield call(promiseWorker, actions.actionRegister(login, password));
  let token = yield call(promiseWorker, actions.actionLogin(login, password));
  if (token) {
    yield put(actions.actionAuthLogin(token));
    let { auth } = yield select();
    let nick = login;
    if (nick.includes("@")) {
      nick = nick.substring(0, nick.indexOf("@"));
      if (nick.length > 8) {
        nick = nick.substring(0, 8);
      }
    }
    let { id } = auth?.payload?.sub;
    yield call(promiseWorker, actions.actionUserUpdate({ _id: id, nick }));
    yield put(actions.actionAboutMe());
  }
}

function* registerWatcher() {
  yield takeEvery("FULL_REGISTER", registerWorker);
}

function* setAvatarWorker({ file }) {
  let { _id } = yield call(promiseWorker, actions.actionUploadFile(file));
  let { auth } = yield select();
  if (auth) {
    let { id } = auth?.payload?.sub;
    yield call(
      promiseWorker,
      actions.actionUserUpdate({ _id: id, avatar: { _id } })
    );
    yield put(actions.actionAboutMe());
  }
}

function* setAvatarWatcher() {
  yield takeEvery("SET_AVATAR", setAvatarWorker);
}

function* setNicknameWorker({ _id, nick }) {
  yield call(promiseWorker, actions.actionUserUpdate({ _id, nick }));
  yield put(actions.actionAboutMe());
}

function* setNicknameWatcher() {
  yield takeEvery("SET_NICKNAME", setNicknameWorker);
}

function* setEmailWorker({ _id, login }) {
  //   await dispatch(actionUserUpdate({ _id, nick }));
  //   await dispatch(actionAboutMe());
  yield call(promiseWorker, actions.actionUserUpdate({ _id, login }));
  yield put(actions.actionAboutMe());
}

function* setEmailWatcher() {
  yield takeEvery("SET_EMAIL", setEmailWorker);
}

function* setNewPasswordWorker({ login, password, newPassword }) {
  yield call(
    promiseWorker,
    actions.actionChangePassword(login, password, newPassword)
  );
  yield put(actions.actionAboutMe());
}

function* setNewPasswordWatcher() {
  yield takeEvery("SET_NEW_PASSWORD", setNewPasswordWorker);
}

export function* searchWorker({ text }) {
  yield put(actions.actionSearchResult({ payload: null }));
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
  yield put(actions.actionSearchResult({ payload }));
}

function* searchWatcher() {
  yield takeLatest("SEARCH", searchWorker);
}

function* findPlaylistByOwnerWorker() {
  let { auth } = yield select();
  if (auth) {
    let { id } = auth?.payload?.sub;
    yield call(promiseWorker, actions.actionUserPlaylists(id));
    // yield put(actions.actionFindUserPlaylists());
    // yield put(actions.actionAboutMe());
  }
}

function* findPlaylistByOwnerWatcher() {
  yield takeEvery("FIND_PLAYLISTS", findPlaylistByOwnerWorker);
}

function* createPlaylistWorker({ name }) {
  let { auth } = yield select();
  if (auth) {
    // let { id } = auth?.payload?.sub;
    yield call(promiseWorker, actions.actionCreatePlaylist(name));
    yield put(actions.actionFindUserPlaylists());
  }
}

function* createPlaylistWatcher() {
  yield takeEvery("CREATE_PLAYLIST", createPlaylistWorker);
}

function* findTracksWorker() {
  yield call(promiseWorker, actions.actionFindTracks());
}

function* findTracksWatcher() {
  yield takeEvery("FIND_ALL_TRACKS", findTracksWorker);
}

if (localStorage.authToken && history.location.pathname === "/search") {
  console.log("Search");
  store.dispatch(actions.actionAllTracks());
}

function* findUserTracksWorker({ _id }) {
  yield call(promiseWorker, actions.actionUserTracks(_id));
}

function* findUserTracksWatcher() {
  yield takeEvery("FIND_USER_TRACKS", findUserTracksWorker);
}

function* findPlaylistTracksWorker({ _id }) {
  yield call(promiseWorker, actions.actionFindPlaylistTracks(_id));
}

function* findPlaylistTracksWatcher() {
  yield takeEvery("PLAYLIST_TRACKS", findPlaylistTracksWorker);
}

function* loadTracksToPlaylistWorker({ idPlaylist, array }) {
  yield call(
    promiseWorker,
    actions.actionLoadTracksToPlaylist(idPlaylist, array)
  );
}

function* loadTracksToPlaylistWatcher() {
  yield takeEvery("LOAD_TRACKS_PLAYLIST", loadTracksToPlaylistWorker);
}

if (
  localStorage.authToken &&
  history.location.pathname.includes("/myplaylist")
) {
  let { auth } = store.getState();
  if (auth) {
    let currentPlaylistId = history.location.pathname.substring(
      history.location.pathname.lastIndexOf("/") + 1
    );
    store.dispatch(actions.actionPlaylistTracks(currentPlaylistId));
  }
}

const uploadedTracks = [];

export function* uploadTracksToPlaylistWorker({ file }) {
  const currentTracksPlaylist = [];
  let resultArray = [];
  let idPlaylist = history.location.pathname.substring(
    history.location.pathname.lastIndexOf("/") + 1
  );
  let { promise } = yield select();
  if (promise?.playlistTracks?.payload?.tracks) {
    promise?.playlistTracks?.payload?.tracks.map((playlistTrack) =>
      currentTracksPlaylist.push(playlistTrack)
    );
  }
  if (file) {
    let track = yield call(
      promiseWorker,
      actions.actionUploadFile(file, "track")
    );
    uploadedTracks.push(track);
    let allUploadTracks = [...currentTracksPlaylist, ...uploadedTracks];
    allUploadTracks.map((uploadedTrack) =>
      resultArray.push({ _id: uploadedTrack?._id })
    );
    yield put(actions.actionTracksToPlaylist(idPlaylist, resultArray));
  }
  yield put(actions.actionAboutMe());
}

export function* uploadTracksToPlaylistWatcher() {
  yield takeEvery("UPLOAD_TRACKS", uploadTracksToPlaylistWorker);
}

if (localStorage.authToken && history.location.pathname === "/library") {
  store.dispatch(actions.actionFindUserPlaylists());
}

if (localStorage.authToken && history.location.pathname.includes("/profile")) {
  let currentUserId = history.location.pathname.substring(
    history.location.pathname.lastIndexOf("/") + 1
  );
  let { auth } = store.getState();
  if (auth) {
    currentUserId === auth?.payload?.sub?.id
      ? store.dispatch(actions.actionAboutMe())
      : store.dispatch(actions.actionAboutAnotherUser(currentUserId));
  }
}

store.subscribe(() => console.log(store.getState()));

function App() {
  return (
    <Router history={history}>
      <Provider store={store}>
        <div className="App">
          <Header />
          <Sidebar />
          <Main />
          <CAudioController
            name="name"
            currentTime="currentTime"
            duration="duration"
            volume="volume"
          />
        </div>
      </Provider>
    </Router>
  );
}

export default App;
