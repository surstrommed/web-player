import { connect } from "react-redux";
import { CTracks } from "./Tracks";

const SearchResult = ({ promise, search }) =>
  search?.searchResult?.payload?.payload ? (
    <CTracks tracks={search?.searchResult?.payload?.payload} />
  ) : (
    <h2 className="mt-5 text-center">
      {promise?.user?.payload?.nick ? promise?.user?.payload?.nick : "user"}, по
      вашему запросу ничего не было найдено.
    </h2>
  );

export const CSearchResult = connect(
  (state) => ({ promise: state.promise, search: state.search || [] }),
  null
)(SearchResult);
