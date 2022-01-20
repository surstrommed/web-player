import { connect } from "react-redux";
import { CSearchResult } from "../components/SearchResult";
import { AuthCheck } from "./../components/AuthCheck";
import { history } from "./../App";
import { CTrack } from "../components/Track";
import { PlayerHeader } from "./../components/PlayerHeader";
import { Loader } from "./../components/Loader";
import { useState } from "react";
import { actionSearch } from "./../actions/index";

const SearchField = connect(null, { onChangeSearch: actionSearch })(
  ({ onChangeSearch }) => {
    const [text, setText] = useState("");
    return (
      <div className="input-group rounded">
        <input
          type="search"
          className="form-control rounded"
          placeholder="Поиск музыки"
          aria-label="Поиск"
          aria-describedby="search-addon"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            onChangeSearch(text);
          }}
        />
      </div>
    );
  }
);

const Search = ({ search, auth, promise }) => {
  return (
    <div className="SearchPage">
      {auth.token && history.location.pathname === "/search" ? (
        <div className="d-block mx-auto mt-2 container w-50">
          <h1 className="text-center">Поиск по сайту</h1>
          <SearchField />
          {promise?.tracks?.payload?.length !== 0 ? <PlayerHeader /> : null}
          {search?.searchResult?.payload?.payload ? (
            <CSearchResult />
          ) : promise.tracks.status === "PENDING" ? (
            <Loader />
          ) : promise?.tracks?.payload &&
            promise?.tracks?.payload?.length !== 0 ? (
            promise.tracks.payload.map((track, index) => (
              <CTrack audio={track} index={index} key={Math.random()} />
            ))
          ) : (
            <h2 className="mt-5 text-center">
              {promise?.user?.payload?.nick
                ? promise?.user?.payload?.nick
                : "user"}
              , на сайте не обнаружено треков.
            </h2>
          )}
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
  (state) => ({
    search: state.search,
    auth: state.auth,
    promise: state.promise,
  }),
  null
)(Search);
