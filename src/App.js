import { Main } from "./components/Main";
import { Header } from "./components/Header";
import { Router } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { createBrowserHistory } from "history";
import { promiseReducer, authReducer } from "./reducers/index";
import { Sidebar } from "./components/Sidebar";
import "./App.scss";
import { actionAboutMe } from "./actions";
export const history = createBrowserHistory();

export const store = createStore(
  combineReducers({
    promise: promiseReducer,
    auth: authReducer,
  }),
  applyMiddleware(thunk)
);

if (localStorage.authToken) {
  store.dispatch(actionAboutMe());
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
