import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from "cdbreact";
import { NavLink } from "react-router-dom";
import { Logo } from "../Other/Logo";

export const Sidebar = () => {
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        overflow: "scroll initial",
        top: 0,
        position: "fixed",
      }}
    >
      <CDBSidebar backgroundColor="#212529">
        <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large"></i>}>
          <Logo />
        </CDBSidebarHeader>
        <CDBSidebarContent className="sidebar-content">
          <CDBSidebarMenu>
            {/*<NavLink exact to="/" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="columns">Главная</CDBSidebarMenuItem>
            </NavLink>*/}
            <NavLink exact to="/search" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="search">Поиск</CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/library" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="user">Моя музыка</CDBSidebarMenuItem>
            </NavLink>
          </CDBSidebarMenu>
        </CDBSidebarContent>
      </CDBSidebar>
    </div>
  );
};
