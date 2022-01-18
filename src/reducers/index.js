import { jwtDecode } from "./../helpers/index";

export function promiseReducer(
  state = {},
  { type, status, payload, error, name }
) {
  if (type === "PROMISE") {
    return {
      ...state,
      [name]: { status, payload, error },
    };
  }
  return state;
}

export function authReducer(state, { type, token }) {
  if (!state) {
    if (localStorage.authToken) {
      type = "AUTH_LOGIN";
      token = localStorage.authToken;
    } else state = {};
  }
  if (type === "AUTH_LOGIN") {
    let payload = jwtDecode(token);
    if (!!token && typeof payload === "object") {
      localStorage.authToken = token;
      return {
        ...state,
        token,
        payload,
      };
    } else return state;
  }
  if (type === "AUTH_LOGOUT") {
    localStorage.removeItem("authToken");
    return {};
  }
  return state;
}

export const localStoredReducer =
  (reducer, localStorageName) => (state, action) => {
    if (!state && localStorage[localStorageName]) {
      return JSON.parse(localStorage[localStorageName]);
    } else {
      let newState = reducer(state, action);
      localStorage.setItem(localStorageName, JSON.stringify(newState));
      return newState;
    }
  };

// track: {_id, url, originalFileName}
// playlist: {_id, name, tracks: [{_id}, {_id}, ...tracks]}

export const playerReducer = (
  state = {},
  {
    type,
    track,
    isPlaying,
    isPaused,
    duration,
    playlist,
    playlistIndex,
    currentTime,
    volume,
  }
) => {
  if (type === "LOAD_TRACK") {
    return {
      ...state,
      track,
      duration,
      playlist,
      playlistIndex,
    };
  }
  if (type === "PLAY_TRACK") {
    return {
      ...state,
      isPlaying,
      isPaused: !isPlaying,
    };
  }
  if (type === "PAUSE_TRACK") {
    return {
      ...state,
      isPaused,
      isPlaying: !isPaused,
    };
  }
  if (type === "VOLUME_TRACK") {
    return {
      ...state,
      volume,
    };
  }
  if (type === "TIME_TRACK") {
    return {
      ...state,
      currentTime,
    };
  }
  return state;
};

export function routeReducer(state = {}, { type, match }) {
  if (type === "ROUTE") {
    return match;
  }
  return state;
}
