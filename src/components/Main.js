import React from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import { CLoginForm } from "../pages/Login";
import { CSignUpForm } from "../pages/Register";
import { Page404 } from "../pages/Page404";
import { CSearch } from "./../pages/Search";
import { CLibrary } from "./../pages/Library";
import { CProfile } from "./../pages/Profile";
import { MyPlaylistTracks } from "./Playlist";
import { CProtectedRoute, CRRoute } from "./RRoute";

const Content = ({ children }) => <div className="Content">{children}</div>;

const PageMain = () => {
  return (
    <div className="MainContent">
      <h1 className="text-center">Главная страница</h1>
    </div>
  );
};

export const Main = () => (
  <main className="Main" style={{ height: "150vh" }}>
    <Content>
      <Switch>
        <CRRoute path="/" component={withRouter(PageMain)} exact />
        <CRRoute path="/login" component={withRouter(CLoginForm)} />
        <CRRoute path="/signup" component={withRouter(CSignUpForm)} />
        <CProtectedRoute
          roles={["admin", "user"]}
          path="/search"
          fallback="/"
          component={withRouter(CSearch)}
        />
        <CProtectedRoute
          roles={["user"]}
          path="/library"
          fallback="/"
          component={withRouter(CLibrary)}
        />
        <CProtectedRoute
          roles={["user"]}
          path="/profile/:_id"
          fallback="/"
          component={withRouter(CProfile)}
        />
        <CProtectedRoute
          roles={["user"]}
          path="/myplaylist/:_id"
          fallback="/"
          component={withRouter(MyPlaylistTracks)}
        />
        <CRRoute path="" component={withRouter(Page404)} />
      </Switch>
    </Content>
  </main>
);
