import { connect } from "react-redux";
import { CTracks } from "./Tracks";
import { PlayerHeader } from "./PlayerHeader";

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

export const CSearchResult = connect(
  (state) => ({ promise: state.promise, search: state.search }),
  null
)(SearchResult);
