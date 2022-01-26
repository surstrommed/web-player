import { backURL, gql } from "../helpers";

export const actionUserUpdate = ({ _id, login, password, nick, avatar }) =>
  actionPromise(
    "userUpdate",
    gql(
      `mutation userUpdate($user:UserInput){
        UserUpsert(user: $user){
          _id login nick avatar {
            _id, url
          }
        }
      }
  `,
      {
        user: {
          _id,
          login,
          password,
          nick,
          avatar,
        },
      }
    )
  );

export const actionChangePassword = (login, password, newPassword) =>
  actionPromise(
    "changePassword",
    gql(
      `mutation changePass($login:String!, $password:String!, $newPassword:String!){
        changePassword(login:$login, password: $password, newPassword: $newPassword){
          _id login
        }
      }`,
      { login, password, newPassword },
      true
    )
  );

export const actionLogin = (login, password) =>
  actionPromise(
    "login",
    gql(
      `query log($login:String!, $password:String!){
        login(login: $login, password: $password)
      }`,
      { login, password }
    )
  );

export const actionRegister = (login, password) =>
  actionPromise(
    "registration",
    gql(
      `mutation reg($login:String!, $password:String!) {
        createUser(login:$login, password: $password) {
        _id login
    }
  }
  `,
      { login, password }
    )
  );

export const actionFindUser = (_id, type = "myUser") =>
  actionPromise(
    `${type}`,
    gql(
      `query findUser($q:String){
        UserFindOne(query:$q){
          _id login nick createdAt avatar {
            _id url
          }
        }
      }
  `,
      { q: JSON.stringify([{ _id }]) }
    )
  );

export const actionFindUsers = () =>
  actionPromise(
    "users",
    gql(
      `query findUsers($q:String){
        UserFind(query: $q){
          _id login nick avatar {
            _id url
          }
        }
      }
  `,
      { q: "[{}]" }
    )
  );

export const actionFindTracks = (skip) =>
  actionPromise(
    "tracks",
    gql(
      `query findTracks($q:String){
        TrackFind(query: $q) {
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
      }
  `,
      {
        // { q: "[{}]" }
        q: JSON.stringify([
          {},
          {
            sort: [{ _id: -1 }],
            skip: [skip || 0],
            limit: [30],
          },
        ]),
      }
    )
  );

export const actionFindUserTracks = (_id, type = "myTracks") =>
  // поиск по айди пользователя его треков
  actionPromise(
    `${type}`,
    gql(
      `query findTracks($q:String){
        TrackFind(query: $q) {
          _id url originalFileName
          id3 {
              title, artist
          }
          playlists {
              _id, name
          }
      }
      }
  `,
      { q: JSON.stringify([{ ___owner: _id }]) }
    )
  );

export const actionUserTracks = (_id) =>
  // поиск одного трека по его айди
  actionPromise(
    "userTracks",
    gql(
      `
          query getUserTracks($q: String!) {
              TrackFind(query: $q) {
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
          }
      `,
      { q: JSON.stringify([{ _id }]) }
    )
  );

export const actionUserPlaylists = (_id) =>
  actionPromise(
    "userPlaylists",
    gql(
      `
          query getPlaylistByOwnerId($q:String!) {
              PlaylistFind(query: $q) {
                _id name owner {login} tracks {_id url originalFileName}
              }
          }
      `,
      { q: JSON.stringify([{ ___owner: _id }]) }
    )
  );

export const actionCreatePlaylist = (name) =>
  actionPromise(
    "createPlaylist",
    gql(
      `mutation p($playlist:PlaylistInput) {
   PlaylistUpsert(playlist:$playlist) {
   _id 
   }
}`,
      { playlist: { name } }
    )
  );

export const actionFindPlaylistTracks = (_id) =>
  actionPromise(
    "playlistTracks",
    gql(
      `query playlistTracks($q:String) {
 PlaylistFindOne(query:$q) {
 _id name tracks {_id url originalFileName} owner {_id login}
 }
}`,
      { q: JSON.stringify([{ _id }]) }
    )
  );

export const actionLoadTracksToPlaylist = (idPlaylist, array) =>
  actionPromise(
    "loadTracksToPlaylist",
    gql(
      `mutation loadTracksToPlaylist($playlist:PlaylistInput) {
 PlaylistUpsert(playlist:$playlist) {
 _id name tracks {_id url originalFileName} owner {_id login}
 }
}`,
      { playlist: { _id: idPlaylist, tracks: array } }
    )
  );

export const actionUploadFile = (file, type = "photo") => {
  let fd = new FormData();
  fd.append(type, file);
  return actionPromise(
    `${type === "photo" ? "uploadPhoto" : "uploadTrack"}`,
    fetch(`${backURL}/${type === "photo" ? "upload" : "track"}`, {
      method: "POST",
      headers: localStorage.authToken
        ? { Authorization: "Bearer " + localStorage.authToken }
        : {},
      body: fd,
    }).then((res) => res.json())
  );
};

// ================================================

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

export const actionAboutAnotherUser = (id) => ({
  type: "ABOUT_ANOTHER_USER",
  id,
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
