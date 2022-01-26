import { connect } from "react-redux";
import { CSearchResult } from "../components/SearchResult";
import { AuthCheck } from "./../components/AuthCheck";
import { history } from "./../App";
import { CTracks } from "../components/Tracks";
import { PlayerHeader } from "./../components/PlayerHeader";
import { useState } from "react";
import { actionSearch } from "./../actions/index";
import { CPreloader } from "./../components/Preloader";

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

const Search = ({ search, promise }) => {
  return (
    <div className="SearchPage">
      <div className="d-block mx-auto mt-2 container w-50">
        <h1 className="text-center">Поиск по сайту</h1>
        <SearchField />
        {search?.searchResult?.payload?.payload ? (
          <CSearchResult />
        ) : promise?.tracks?.payload?.length !== 0 ? (
          <div>
            <PlayerHeader />
            <CPreloader
              promiseName={"tracks"}
              promiseState={promise}
              children={<CTracks tracks={promise?.tracks?.payload} />}
            />
          </div>
        ) : (
          <h2 className="mt-5 text-center">
            {promise?.myUser?.payload?.nick
              ? promise?.myUser?.payload?.nick
              : "user"}
            , по запросу не было найдено треков.
          </h2>
        )}
      </div>
      <div className="container" style={{ height: "300px" }}></div>
    </div>
  );
};

export const CSearch = connect(
  (state) => ({
    search: state.search,
    promise: state.promise,
  }),
  null
)(Search);
