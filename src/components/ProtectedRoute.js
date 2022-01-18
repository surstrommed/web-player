import { CRRoute } from "./RRoute";
import { connect } from "react-redux";

const ProtectedRoute = ({
  fallback = "/",
  roles = ["admin"],
  auth,
  component: Component,
  ...routeProps
}) => {
  const WrapperComponent = (componentProps) => {
    // let {acl} = auth?.
    return <Component {...componentProps} />;
  };
  return <CRRoute {...routeProps} component={WrapperComponent} />;
};

export const CProtectedRoute = connect((state) => ({ auth: state.auth }))(
  ProtectedRoute
);
