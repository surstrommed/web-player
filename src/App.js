import { Main } from "./components/Main/Main";
import { Header } from "./components/Main/Header";
import { Router } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { createBrowserHistory } from "history";
import { Sidebar } from "./components/Main/Sidebar";
import "./App.scss";
import createSagaMiddleware from "redux-saga";
import { all } from "redux-saga/effects";
import {
  promiseReducer,
  authReducer,
  localStoredReducer,
  searchReducer,
  playerReducer,
  routeReducer,
  scrollTracksReducer,
} from "./reducers/index";
import { CAudioController } from "./components/Audio/AudioController";
import {
  audioLoadWatcher,
  audioPlayWatcher,
  audioPauseWatcher,
  audioPrevTrackWatcher,
  audioNextTrackWatcher,
  audioSetDurationWatcher,
  audioSetVolumeWatcher,
  audioSetCurrentTimeWatcher,
  audioSetSeekTimeTrackWatcher,
} from "./components/Audio/AudioHandler";
import * as otherSaga from "./actions/sagas";
import {
  actionFindUserPlaylists,
  actionAllTracks,
  actionFullClearTracks,
  actionAboutMe,
} from "./actions/types";

export const history = createBrowserHistory();

const sagaMiddleware = createSagaMiddleware();

export const store = createStore(
  combineReducers({
    promise: localStoredReducer(promiseReducer, "promise"),
    auth: localStoredReducer(authReducer, "auth"),
    player: localStoredReducer(playerReducer, "player"),
    route: localStoredReducer(routeReducer, "route"),
    loadedTracks: localStoredReducer(scrollTracksReducer, "loadedTracks"),
    search: searchReducer,
  }),
  applyMiddleware(sagaMiddleware)
);

function* rootSaga() {
  yield all([
    audioLoadWatcher(),
    audioSetDurationWatcher(),
    audioPlayWatcher(),
    audioPauseWatcher(),
    audioPrevTrackWatcher(),
    audioNextTrackWatcher(),
    audioSetCurrentTimeWatcher(),
    audioSetSeekTimeTrackWatcher(),
    audioSetVolumeWatcher(),
    otherSaga.promiseWatcher(),
    otherSaga.aboutMeWatcher(),
    otherSaga.routeWatcher(),
    otherSaga.loginWatcher(),
    otherSaga.registerWatcher(),
    otherSaga.findTracksWatcher(),
    otherSaga.findUserTracksWatcher(),
    otherSaga.setAvatarWatcher(),
    otherSaga.setNicknameWatcher(),
    otherSaga.setEmailWatcher(),
    otherSaga.setNewPasswordWatcher(),
    otherSaga.searchWatcher(),
    otherSaga.findPlaylistByOwnerWatcher(),
    otherSaga.createPlaylistWatcher(),
    otherSaga.findPlaylistTracksWatcher(),
    otherSaga.loadTracksToPlaylistWatcher(),
    otherSaga.uploadTracksToPlaylistWatcher(),
    otherSaga.loadNewTracksWatcher(),
    otherSaga.addSkipTracksWatcher(),
    otherSaga.clearSkipTracksWatcher(),
  ]);
}

sagaMiddleware.run(rootSaga);

if (localStorage.authToken) {
  store.dispatch(actionFindUserPlaylists());
  store.dispatch(actionFullClearTracks());
  store.dispatch(actionAllTracks());
  store.dispatch(actionAboutMe());
}

export const { ...states } = store.getState();

console.log(states);

store.subscribe(() => console.log(store.getState()));

function App() {
  return (
    <Router history={history}>
      <Provider store={store}>
        <div className="App">
          <Header />
          <Sidebar />
          <Main />
          {states?.auth?.token ? <CAudioController /> : null}
        </div>
      </Provider>
    </Router>
  );
}

export default App;
