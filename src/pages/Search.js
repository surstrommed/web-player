import { connect } from "react-redux";
import { CTracks } from "../components/Playlist/SearchTracks";
import { PlayerHeader } from "../components/Playlist/PlayerHeader";
import { useState } from "react";
import { CPreloader } from "../components/Other/Preloader";
import { actionSearch, actionSetSearch } from "../actions/types";

const SearchField = connect(null, {
  onChangeSearch: actionSearch,
  setSearch: actionSetSearch,
})(({ onChangeSearch, setSearch }) => {
  const [text, setText] = useState("");
  return (
    <div className="input-group mb-3">
      <input
        type="text"
        className="form-control"
        placeholder="Поиск по всей музыке"
        aria-label="Поиск"
        aria-describedby="basic-addon2"
        onFocus={() => {
          setSearch(true);
        }}
        onChange={(e) => {
          setText(e.target.value);
          onChangeSearch(text);
        }}
        value={text}
      />
      <div className="input-group-append">
        <button
          className="btn btn-dark"
          type="button"
          onClick={() => {
            setSearch(false);
            setText("");
          }}
        >
          Отменить
        </button>
      </div>
    </div>
  );
});

const SearchResult = ({ promise, search }) =>
  search?.searchResult?.payload?.payload?.length !== 0 ? (
    <>
      <PlayerHeader />
      <CTracks tracks={search?.searchResult?.payload?.payload} search />
    </>
  ) : (
    <h2 className="mt-5 text-center">
      {promise?.myUser?.payload?.nick ? promise?.myUser?.payload?.nick : "user"}
      , по вашему запросу ничего не было найдено.
    </h2>
  );

const CSearchResult = connect(
  (state) => ({ promise: state.promise, search: state.search }),
  null
)(SearchResult);

const Search = ({ search, promise, loadedTracks }) => {
  return (
    <div>
      <div className="d-block mx-auto mt-2 container w-50">
        <h1 className="text-center">Поиск по сайту</h1>
        <SearchField />
        {search?.setSearch ? (
          <CSearchResult />
        ) : loadedTracks?.loadedTracks?.length !== 0 ? (
          <div>
            <PlayerHeader />
            <CPreloader
              promiseName={"tracks"}
              promiseState={promise}
              children={<CTracks tracks={loadedTracks?.loadedTracks} />}
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
    loadedTracks: state.loadedTracks,
  }),
  null
)(Search);
