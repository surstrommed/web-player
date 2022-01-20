import React from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import { CLoginForm } from "../pages/Login";
import { CSignUpForm } from "../pages/Register";
import { Page404 } from "../pages/Page404";
import { CSearch } from "./../pages/Search";
import { CLibrary } from "./../pages/Library";
import { CProfile } from "./../pages/Profile";
import { CMyPlaylistTracks } from "./Playlist";

const Content = ({ children }) => <div className="Content">{children}</div>;

const PageMain = () => {
  return (
    <div className="MainContent">
      <h1>Главная страница</h1>
    </div>
  );
};

export const Main = () => (
  <main className="Main">
    <Content>
      <Switch>
        <Route path="/" component={withRouter(PageMain)} exact />
        <Route path="/login" component={withRouter(CLoginForm)} />
        <Route path="/signup" component={withRouter(CSignUpForm)} />
        <Route path="/search" component={withRouter(CSearch)} />
        <Route path="/library" component={withRouter(CLibrary)} />
        <Route path="/profile" component={withRouter(CProfile)} />
        <Route
          path="/myplaylist/:_id"
          component={withRouter(CMyPlaylistTracks)}
        />
        <Route path="" component={withRouter(Page404)} />
      </Switch>
    </Content>
  </main>
);
