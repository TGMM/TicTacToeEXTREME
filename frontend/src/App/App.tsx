import React from "react";
import { Outlet } from "react-router-dom";
import ResponsiveAppBar from "../ResponsiveNavbar/ResponsiveAppBar";
import "./App.css";

export default function App() {
  return (
    <div className="grid">
      <ResponsiveAppBar></ResponsiveAppBar>
      <Outlet></Outlet>
    </div>
  );
}