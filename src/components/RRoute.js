import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";
import { AuthCheck } from "./AuthCheck";

const RRoute = ({ action, component: Component, ...routeProps }) => {
  const WrapperComponent = (componentProps) => {
    action(componentProps.match);
    return <Component {...componentProps} />;
  };
  return <Route {...routeProps} component={WrapperComponent} />;
};

export const CRRoute = connect(null, {
  action: (match) => ({ type: "ROUTE", match }),
})(RRoute);

const ProtectedRoute = ({
  fallback = "/",
  roles = ["user"],
  auth,
  component: Component,
  ...routeProps
}) => {
  const WrapperComponent = (componentProps) => {
    let aclRoles = auth?.payload?.sub.acl;
    if (localStorage?.authToken && aclRoles?.length > 0) {
      aclRoles = aclRoles.filter((item) =>
        roles.includes(item) ? item : null
      );
      if (aclRoles.length > 0) {
        return <Component {...componentProps} />;
      }
    }
    if (localStorage?.authToken) {
      return <Component {...componentProps} />;
    }
    // return <Redirect to={fallback} />;
    return <AuthCheck />;
  };
  return <CRRoute {...routeProps} component={WrapperComponent} />;
};

export const CProtectedRoute = connect((state) => ({ auth: state.auth }))(
  ProtectedRoute
);
