import React, { Fragment }  from "react";
import { Outlet } from "react-router-dom";
import ResponsiveAppBar from "../ResponsiveNavbar/ResponsiveAppBar";

export default function App() {
  return (
    <Fragment>
      <ResponsiveAppBar></ResponsiveAppBar>
      <Outlet></Outlet>
    </Fragment>
  );
}