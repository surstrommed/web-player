import { NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { history, store } from "../../App";
import { backURL } from "../../helpers";
import { actionAuthLogout } from "../../actions/types";

const Auth = ({ auth, promise, route, actionLogOut }) => {
  if (auth?.token && (route?.url === "/login" || route?.url === "/signup")) {
    history.push("/");
  }
  let id;
  if (auth?.token) {
    id = store.getState()?.auth?.payload?.sub?.id;
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
                  promise?.myUser?.payload?.avatar
                    ? `${backURL}/${promise.myUser.payload.avatar.url}`
                    : "https://i.ibb.co/bBxzmTm/default-avatar.jpg"
                }
                alt="Avatar"
              />
              {promise?.myUser?.payload?.nick}
            </div>
          }
          menuVariant="dark"
        >
          <NavDropdown.Item
            componentclass={Link}
            href={`/profile/${id}`}
            to={`/profile/${id}`}
          >
            Профиль
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
  (state) => ({ route: state.route, auth: state.auth, promise: state.promise }),
  {
    actionLogOut: actionAuthLogout,
  }
)(Auth);
