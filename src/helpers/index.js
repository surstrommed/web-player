import { useState } from "react";

export const skipValue = 30;

export const jwtDecode = (token) => {
  try {
    let arrToken = token.split(".");
    let base64Token = atob(arrToken[1]);
    return JSON.parse(base64Token);
  } catch (e) {
    console.log("Error JWT: " + e);
  }
};

export const getGQL =
  (url) =>
  async (query, variables = {}, skip = false) => {
    let obj = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(localStorage.authToken && !skip
          ? { Authorization: "Bearer " + localStorage.authToken }
          : {}),
      },
      body: JSON.stringify({ query, variables }),
    });
    let a = await obj.json();
    if (!a.data && a.errors) throw new Error(JSON.stringify(a.errors));
    return a.data[Object.keys(a.data)[0]];
  };

export const backURL = "http://player.asmer.fs.a-level.com.ua";

export const gql = getGQL(backURL + "/graphql");

export function validateEmail(email) {
  return /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(
    email.toLowerCase()
  );
}

export function validatePassword(password) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{6,}/.test(password);
}

export function validateNickname(nick) {
  return /^[a-z0-9_-]{3,8}$/.test(nick);
}

export const delay = (ms) => new Promise((ok) => setTimeout(() => ok(ms), ms));

export const useLocalStoredState = (defaultState, localStorageName) => {
  let payload;
  try {
    payload = JSON.parse(localStorage[localStorageName]);
  } catch {
    payload = defaultState;
  }
  const [state, setState] = useState(payload);
  return [
    state,
    (newState) => {
      setState(newState);
      localStorage.setItem(localStorageName, newState);
    },
  ];
};

export const useProxyState = (defaultState) => {
  const [state, setState] = useState(defaultState);
  return new Proxy(state, {
    get(obj, key) {
      return obj[key];
    },
    set(obj, key, value) {
      setState({ ...obj, [key]: value });
      return true;
    },
  });
};
