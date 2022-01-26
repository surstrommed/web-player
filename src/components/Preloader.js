import { Loader } from "./Loader";
import { connect } from "react-redux";

const RejectedAlert = ({ error }) => <div>Произошла ошибка: {error}</div>;

const Preloader = ({ promiseName, promiseState, children }) => (
  <>
    {promiseState[promiseName]?.status === "RESOLVED" ? (
      children
    ) : promiseState[promiseName]?.status === "REJECTED" ? (
      <RejectedAlert error={promiseState[promiseName]?.error} />
    ) : (
      <Loader />
    )}
  </>
);
export const CPreloader = connect((state) => ({ promiseState: state.promise }))(
  Preloader
);
