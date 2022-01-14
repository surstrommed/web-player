import { connect } from "react-redux";
import { SearchField } from "./../components/SearchField";
import { AuthCheck } from "./../components/AuthCheck";
import { history } from "./../App";
import { Button } from "react-bootstrap";
import { actionFindTracks, actionFindUser } from "./../actions/index";
import { backURL } from "./../helpers/index";
import { Audio } from "./../components/Audio";

const Search = ({ auth, actionTracks, actionUser }) => {
  return (
    <div className="SearchPage">
      {auth.token && history.location.pathname === "/search" ? (
        <div className="d-block mx-auto mt-2 container w-50">
          <h1>Поиск по сайту</h1>
          <SearchField />
          <Button onClick={() => actionTracks()}>Tracks</Button>
          <Audio />
        </div>
      ) : (
        <div className="d-block mx-auto mt-2 container w-50">
          <AuthCheck header="Поиск по сайту" />
        </div>
      )}
    </div>
  );
};

export const CSearch = connect(
  (state) => ({ auth: state.auth, promise: state.promise }),
  {
    actionTracks: actionFindTracks,
    actionUser: actionFindUser,
  }
)(Search);
