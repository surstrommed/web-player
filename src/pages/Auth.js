import { actionAuthLogout } from "../actions/index";
import { NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { history } from "../App";
import { backURL } from "../helpers";

const Auth = ({ auth, promise, actionLogOut }) => {
  if (
    auth.token &&
    (history.location.pathname === "/login" ||
      history.location.pathname === "/signup")
  ) {
    history.push("/");
  }
  if (auth.token) {
    localStorage.authToken = auth.token;
  }
  return (
    <>
      {auth.payload ? (
        <NavDropdown
          id="dropdownProfileMenu"
          title={
            <div className="pull-left d-inline-block">
              <img
                className="thumbnail-image avatarHeader"
                src={
                  promise?.user?.payload?.avatar
                    ? `${backURL}/${promise.user.payload.avatar.url}`
                    : "https://i.ibb.co/bBxzmTm/default-avatar.jpg"
                }
                alt="Avatar"
              />
              {promise?.user?.payload?.nick}
            </div>
          }
          menuVariant="dark"
        >
          <NavDropdown.Item
            componentclass={Link}
            href="/profile"
            to={`/profile`}
          >
            Профиль
          </NavDropdown.Item>
          <NavDropdown.Item
            componentclass={Link}
            href="/settings"
            to={`/settings`}
          >
            Настройки
          </NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item as="button" onClick={() => actionLogOut()}>
            Выйти
          </NavDropdown.Item>
        </NavDropdown>
      ) : (
        <>
          <Link className="nav-link" to={"/signup"}>
            Зарегистрироваться
          </Link>
          <Link className="btn btn-light" to={"/login"}>
            Войти
          </Link>
        </>
      )}
    </>
  );
};

export const CAuth = connect(
  (state) => ({ auth: state.auth, promise: state.promise }),
  {
    actionLogOut: actionAuthLogout,
  }
)(Auth);
