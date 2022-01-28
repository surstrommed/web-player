import { connect } from "react-redux";
import { CMyProfile } from "./../components/Profile/MyProfile";

const Profile = ({ route }) => {
  let currentUserId = route?.params?._id;
  return <CMyProfile id={currentUserId} />;
};

export const CProfile = connect(
  (state) => ({ route: state.route }),
  null
)(Profile);
