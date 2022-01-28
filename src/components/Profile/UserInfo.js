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
      {date ? (
        <div className="text-center">
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
        </div>
      ) : (
        <Page404 />
      )}
    </>
  );
};

const UserInfo = ({ id, auth, promise }) => {
  return (
    <InfoRender
      avatar={
        id === auth?.payload?.sub?.id
          ? promise?.myUser?.payload?.avatar?.url
          : promise?.anotherUser?.payload?.avatar?.url
      }
      nick={
        id === auth?.payload?.sub?.id
          ? promise?.myUser?.payload?.nick
          : promise?.anotherUser?.payload?.nick
          ? promise?.anotherUser?.payload?.nick
          : promise?.anotherUser?.payload?.login
      }
      date={
        id === auth?.payload?.sub?.id
          ? promise?.myUser?.payload?.createdAt
          : promise?.anotherUser?.payload?.createdAt
      }
    />
  );
};

export const CUserInfo = connect(
  (state) => ({ auth: state.auth, promise: state.promise }),
  null
)(UserInfo);
