import React from "react";
import { Switch } from "react-router-dom";
import { CProtectedRoute, CRRoute } from "./../Other/RRoute";
import { CProfile } from "./../../pages/Profile";
import { CLibrary } from "./../../pages/Library";
import { CSearch } from "./../../pages/Search";
import { Page404 } from "./../../pages/Page404";
import { CSignUpForm } from "./../../pages/Register";
import { CLoginForm } from "./../../pages/Login";
import { MyPlaylistTracks } from "./../Playlist/Playlist";
import gif from "../../images/gifka.gif";

const Content = ({ children }) => <div className="Content">{children}</div>;
const PageMain = () => {
  return (
    <div className="Main text-center">
      <div class="containerMain mt-5">
        <h1 className="neon-text">Добро пожаловать в Navy Web Player!</h1>
      </div>
      <img src={gif} alt="background" style={{ width: "30%", height: "30%" }} />
    </div>
  );
};

export const Main = () => (
  <main className="Main" style={{ height: "150vh" }}>
    <Content>
      <Switch>
        <CRRoute path="/" component={PageMain} exact />
        <CRRoute path="/login" component={CLoginForm} />
        <CRRoute path="/signup" component={CSignUpForm} />
        <CProtectedRoute
          roles={["user"]}
          path="/search"
          fallback="/"
          component={CSearch}
        />
        <CProtectedRoute
          roles={["user"]}
          path="/library"
          fallback="/"
          component={CLibrary}
        />
        <CProtectedRoute
          roles={["user"]}
          path="/profile/:_id"
          fallback="/"
          component={CProfile}
        />
        <CProtectedRoute
          roles={["user"]}
          path="/myplaylist/:_id"
          fallback="/"
          component={MyPlaylistTracks}
        />
        <CRRoute path="*" component={Page404} />
      </Switch>
    </Content>
  </main>
);
