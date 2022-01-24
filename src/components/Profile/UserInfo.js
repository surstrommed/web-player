import { connect } from "react-redux";
import { backURL } from "../../helpers/index";
import { Page404 } from "../../pages/Page404";
// 61e9c85ec2305e2f502acd77s

const InfoRender = ({ avatar, nick, date }) => {
  let dmy = [],
    dateReg = new Date(+date);
  dmy = [
    ("0" + dateReg.getDate()).slice(-2),
    ("0" + (dateReg.getMonth() + 1)).slice(-2),
    dateReg.getFullYear(),
  ];
  return (
    <>
    {date ? <div className="text-center">
    <h1 className="text-center">Информация о профиле пользователя:</h1>
      <div>
        <img
          style={{ width: "6rem" }}
          src={
            avatar
              ? `${backURL}/${avatar}`
              : "https://i.ibb.co/bBxzmTm/default-avatar.jpg"
          }
          className="card-img-top"
          alt="ProfileImage"
        />
      </div>
      <div>Никнейм: {nick}</div>
      <div>Дата регистрации: {dmy.join(".")}</div>
    </div> : <Page404 />}
    </>
  );
};

const UserInfo = ({ id, auth, promise }) => {
  return (
    <>
      {id === auth?.payload?.sub?.id ? (
        <InfoRender
          avatar={promise?.myUser?.payload?.avatar?.url}
          nick={promise?.myUser?.payload?.nick}
          date={promise?.myUser?.payload?.createdAt}
        />
      ) : (
        <InfoRender
          avatar={promise?.anotherUser?.payload?.avatar?.url}
          nick={
            promise?.anotherUser?.payload?.nick
              ? promise?.anotherUser?.payload?.nick
              : promise?.anotherUser?.payload?.login
          }
          date={promise?.anotherUser?.payload?.createdAt}
        />
      )}
    </>
  );
};

// {promise?.myTracks?.status === "RESOLVED" ||
//       promise?.anotherUserTracks?.status === "RESOLVED" ? (
//         id === auth?.payload?.sub?.id ? (
//           promise?.myTracks?.payload ? (
//             <InfoRender
//               avatar={promise?.myUser?.payload?.avatar?.url}
//               nick={promise?.myUser?.payload?.nick}
//               tracksCount={promise?.myTracks?.payload?.length}
//             />
//           ) : null
//         ) : promise?.anotherUserTracks?.payload ? (
//           <InfoRender
//             avatar={promise?.anotherUser?.payload?.avatar?.url}
//             nick={promise?.anotherUser?.payload?.nick}
//             tracksCount={promise?.anotherUserTracks?.payload?.length}
//           />
//         ) : null
//       ) : (
//         <Loader />
//       )}

export const CUserInfo = connect(
  (state) => ({ auth: state.auth, promise: state.promise }),
  null
)(UserInfo);

// findMyTracks: actionFindMyTracks,
// findAnotherUserTracks: actionFindAnotherUserTracks,
