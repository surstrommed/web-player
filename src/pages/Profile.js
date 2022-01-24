import { connect } from "react-redux";
import { history } from "./../App";
import { CMyProfile } from "./../components/Profile/MyProfile";
import { actionAboutMe, actionAboutAnotherUser } from "./../actions/index";

const Profile = ({ promise, auth, aboutMe, aboutAnotherUser }) => {
  let currentUserId = history.location.pathname.substring(
    history.location.pathname.lastIndexOf("/") + 1
  );
  return <CMyProfile id={currentUserId} />;
};

export const CProfile = connect(
  (state) => ({ promise: state.promise, auth: state.auth }),
  {
    aboutMe: actionAboutMe,
    aboutAnotherUser: actionAboutAnotherUser,
  }
)(Profile);
