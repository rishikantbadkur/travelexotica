import React, { useContext, memo } from "react";
import { UserContext } from "../../users/UserProvider";
import Spinner from "../../UI/Spinner/Spinner";

import AdminNav from "./AdminNav";

import styles from "./Layout.module.css";
import stylesGeneral from "../../../styles/general.module.css";
import { Outlet } from "react-router-dom";
import toast from "react-hot-toast";

const Layout = memo(() => {
  const { userState, isLoading, error, setUserState } = useContext(UserContext);

  const logoutHandler = () => {
    const flag = window.confirm("Are you sure, you want to log out ?");

    if (!flag) {
      return;
    }

    localStorage.removeItem("travelExoticaJwt");
    setUserState({ user: [], authenticated: false });

    toast.success("Successfully Logged Out");

    window.location.href = "/app/admin/login";
  };

  if (error) {
    throw new Error(error.message);
  }

  if (userState.user.length > 0) {
    if (userState.user[0].role !== "admin") {
      throw new Error("You are not authorized to access this resource");
    }
  }

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      {!isLoading && userState.user[0]?.role === "admin" && (
        <section className={styles.wrapper}>
          <div className={styles.logo_ctn}>
            <a className={stylesGeneral.header__logo} href="/app/home">
              <aside>
                trav-el-
                <span className={stylesGeneral.text_highlight}>Exotica</span>
              </aside>
            </a>
            <span className={styles.logout_icon} onClick={logoutHandler}>
              <ion-icon name="exit-outline"></ion-icon>
            </span>
          </div>
          <div className={styles.body_ctn}>
            <div className={styles.nav_ctn}>
              <AdminNav />
            </div>
            <div className={styles.body_main_ctn} style={{ height: "80vh" }}>
              <Outlet />
            </div>
          </div>
        </section>
      )}
    </>
  );
});

export default Layout;
