import { backURL, gql } from "../helpers";

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

export const actionPromise = (name, promise) => async (dispatch) => {
  dispatch(actionPending(name));
  try {
    let data = await promise;
    dispatch(actionResolved(name, data));
    return data;
  } catch (error) {
    dispatch(actionRejected(name, error));
  }
};

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
      `query changePass($login:String!, $password:String!, $newPassword:String!){
        changePassword(login:$login, password: $password, newPassword: $newPassword)
      }`,
      { login, password, newPassword }
    )
  );

const actionLogin = (login, password) =>
  actionPromise(
    "login",
    gql(
      `query log($login:String!, $password:String!){
        login(login:$login, password: $password)
      }`,
      { login, password }
    )
  );

const actionRegister = (login, password) =>
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

export const actionFindUser = (_id) =>
  actionPromise(
    "user",
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

export const actionAboutMe = () => async (dispatch, getState) => {
  let { id } = getState().auth.payload.sub;
  await dispatch(actionFindUser(id));
};

export const actionFullLogin = (l, p) => async (dispatch) => {
  let token = await dispatch(actionLogin(l, p));
  if (token) {
    await dispatch(actionAuthLogin(token));
    await dispatch(actionAboutMe());
  }
};

export const actionFullRegister = (l, p) => async (dispatch) => {
  let { _id } = await dispatch(actionRegister(l, p));
  if (_id) {
    let nick = l;
    if (nick.includes("@")) {
      nick = nick.substring(0, nick.indexOf("@"));
      if (nick.length > 8) {
        nick = nick.substring(0, 8);
      }
    }
    await dispatch(actionUserUpdate({ _id, nick }));
    await dispatch(actionFullLogin(l, p));
  }
};

export const actionFindTracks = () =>
  actionPromise(
    "tracks",
    gql(
      `query findTracks($q:String){
        TrackFind(query:$q){
          _id url owner {
            _id login nick
          }
        }
      }
  `,
      { q: "[{}]" }
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

const actionUploadPhoto = (file) => {
  let fd = new FormData();
  fd.append("photo", file);
  return actionPromise(
    "uploadPhoto",
    fetch(`${backURL}/upload`, {
      method: "POST",
      headers: localStorage.authToken
        ? { Authorization: "Bearer " + localStorage.authToken }
        : {},
      body: fd,
    }).then((res) => res.json())
  );
};

export const actionSetAvatar = (file) => async (dispatch, getState) => {
  let { _id } = await dispatch(actionUploadPhoto(file));
  let { id } = getState().auth.payload.sub;
  await dispatch(actionUserUpdate({ _id: id, avatar: { _id } }));
  await dispatch(actionAboutMe());
};
