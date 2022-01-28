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
    window.location.reload();
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

export const searchReducer = (state = {}, { type, action, ...params }) => {
  if (type === "SEARCH_RESULT") {
    return { ...state, searchResult: { ...params } };
  }
  if (type === "SET_SEARCH") {
    return { ...state, setSearch: action };
  }
  return state;
};

let initState = {
  isPlaying: false,
  isPaused: true,
  duration: 0,
  track: null,
  playlist: null,
  indexInPlaylist: null,
  currentTime: 0,
  volume: 0.5,
};

export const playerReducer = (
  state = initState,
  {
    type,
    isPlaying,
    isPaused,
    duration,
    track,
    playlist,
    indexInPlaylist,
    currentTime,
    volume,
  }
) => {
  if (type === "LOAD_TRACK") {
    console.log(track, playlist, indexInPlaylist);
    return {
      ...state,
      track,
      playlist,
      indexInPlaylist,
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
  if (type === "SET_VOLUME") {
    return {
      ...state,
      volume,
    };
  }
  if (type === "SET_DURATION") {
    return {
      ...state,
      duration,
    };
  }
  if (type === "SET_CURRENT_TIME_TRACK") {
    return {
      ...state,
      currentTime,
    };
  }
  if (type === "SET_SEEK_TIME_TRACK") {
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

export function scrollTracksReducer(
  state = {},
  { type, newTracks, skipTracks }
) {
  if (type === "ADD_TRACKS") {
    return {
      ...state,
      loadedTracks: [...newTracks],
    };
  }
  if (type === "ADD_SKIP") {
    return {
      ...state,
      skipTracks: state?.skipTracks
        ? state?.skipTracks + skipTracks
        : skipTracks,
    };
  }
  if (type === "CLEAR_SKIP") {
    return {
      ...state,
      skipTracks: 0,
    };
  }
  return state;
}
