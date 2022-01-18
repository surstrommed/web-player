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
  playerReducer,
  routeReducer,
} from "./reducers/index";
import { Sidebar } from "./components/Sidebar";
import "./App.scss";
import createSagaMiddleware from "redux-saga";
import { all, takeEvery, put, call, select } from "redux-saga/effects";
import * as actions from "./actions";
import { gql } from "./helpers";
export const history = createBrowserHistory();

const sagaMiddleware = createSagaMiddleware();

export const store = createStore(
  combineReducers({
    promise: localStoredReducer(promiseReducer, "promise"),
    auth: localStoredReducer(authReducer, "auth"),
    player: localStoredReducer(playerReducer, "player"),
    route: localStoredReducer(routeReducer, "route"),
    // изменить условия на страницах на отображения по роутам
  }),
  applyMiddleware(sagaMiddleware)
);

function* rootSaga() {
  yield all([
    promiseWatcher(),
    aboutMeWatcher(),
    routeWatcher(),
    loginWatcher(),
    registerWatcher(),
    findTracksWatcher(),
    setAvatarWatcher(),
    setNicknameWatcher(),
    setEmailWatcher(),
    setNewPasswordWatcher(),
    audioPlayWatcher(),
    audioPauseWatcher(),
    audioVolumeWatcher(),
    audioLoadWatcher(),
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
    yield call(promiseWatcher, actions.actionFindUser(id));
  }
}

function* aboutMeWatcher() {
  yield takeEvery("ABOUT_ME", aboutMeWorker);
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
  let { _id } = yield call(
    promiseWorker,
    actions.actionRegister(login, password)
  );
  if (_id) {
    let nick = login;
    if (nick.includes("@")) {
      nick = nick.substring(0, nick.indexOf("@"));
      if (nick.length > 8) {
        nick = nick.substring(0, 8);
      }
    }
    yield call(promiseWorker, actions.actionLogin(login, password));
    yield call(promiseWorker, actions.actionUserUpdate({ _id, nick }));
  }
}

function* registerWatcher() {
  yield takeEvery("FULL_REGISTER", registerWorker);
}

function* findTracksWorker() {
  yield call(promiseWatcher, actions.actionFindTracks());
}

function* findTracksWatcher() {
  yield takeEvery("FIND_TRACKS", findTracksWorker);
}

function* setAvatarWorker({ file }) {
  // async (dispatch, getState) => {
  //   let { _id } = await dispatch(actionUploadPhoto(file));
  //   let { id } = getState().auth.payload.sub;
  //   await dispatch(actionUserUpdate({ _id: id, avatar: { _id } }));
  //   await dispatch(actionAboutMe());
  // };
  let { _id } = yield call(promiseWatcher, actions.actionUploadFile(file)); //upload file
  let { id } = yield select().auth.payload.sub;
  console.log("Set avatar");
  yield call(
    promiseWatcher,
    actions.actionUserUpdate({ _id: id, avatar: { _id } })
  );
  yield put(actions.actionAboutMe());
}

function* setAvatarWatcher() {
  yield takeEvery("SET_AVATAR", setAvatarWorker);
}

function* setNicknameWorker({ _id, nick }) {
  //   await dispatch(actionUserUpdate({ _id, nick }));
  //   await dispatch(actionAboutMe());
  yield call(promiseWatcher, actions.actionUserUpdate({ _id, nick }));
  yield put(actions.actionAboutMe());
}

function* setNicknameWatcher() {
  yield takeEvery("SET_NICKNAME", setNicknameWorker);
}

function* setEmailWorker({ _id, login }) {
  //   await dispatch(actionUserUpdate({ _id, nick }));
  //   await dispatch(actionAboutMe());
  yield call(promiseWatcher, actions.actionUserUpdate({ _id, login }));
  yield put(actions.actionAboutMe());
}

function* setEmailWatcher() {
  yield takeEvery("SET_EMAIL", setEmailWorker);
}

function* setNewPasswordWorker({ login, password, newPassword }) {
  //   await dispatch(actionChangePassword(login, password, newPassword));
  //   await dispatch(actionAboutMe());
  yield call(
    promiseWatcher,
    actions.actionChangePassword(login, password, newPassword)
  );
  yield put(actions.actionAboutMe());
}

function* setNewPasswordWatcher() {
  yield takeEvery("SET_NEW_PASSWORD", setNewPasswordWorker);
}

function* audioLoadWorker({ track, duration, playlist, playlistIndex }) {
  yield put(actions.actionLoadAudio(track, duration, playlist, playlistIndex));
}

function* audioLoadWatcher() {
  yield takeEvery("LOAD_TRACK", audioLoadWorker);
}

function* audioPlayWorker({ isPlaying }) {
  console.log("Play track");
  yield put(actions.actionPlayAudio(isPlaying));
}

function* audioPlayWatcher() {
  yield takeEvery("PLAY_TRACK", audioPlayWorker);
}

function* audioPauseWorker({ isPaused }) {
  yield put(actions.actionPauseAudio(isPaused));
}

function* audioPauseWatcher() {
  yield takeEvery("PAUSE_TRACK", audioPauseWorker);
}

function* audioVolumeWorker({ volume }) {
  yield put(actions.actionVolumeAudio(volume));
}

function* audioVolumeWatcher() {
  yield takeEvery("VOLUME_TRACK", audioVolumeWorker);
}

if (
  localStorage.authToken &&
  (history.location.pathname === "/search" ||
    history.location.pathname === "/library")
) {
  store.dispatch(actions.actionFindTracks());
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
        </div>
      </Provider>
    </Router>
  );
}

export default App;
