import { connect } from "react-redux";
import { CTrack } from "./Track";

const SearchResult = ({ search }) => {
  return (search?.searchResult?.payload?.payload || []).map((track, index) => (
    <CTrack audio={track} index={index} key={Math.random()} />
  ));
};

export const CSearchResult = connect(
  (state) => ({ search: state.search || [] }),
  null
)(SearchResult);
