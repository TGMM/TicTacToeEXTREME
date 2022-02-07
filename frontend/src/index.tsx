import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App/App";
import reportWebVitals from "./reportWebVitals";
import Play from "./Play/Play";
import Skins from "./Skins/Skins";
import Leaderboard from "./Leaderboard/Leaderboard";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { getSession } from "./utils/auth";
import SignIn from "./SignIn/SignIn";
import Register from "./Register/Register";
import Profile from "./Profile/Profile";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={getSession() ? <App/> : <SignIn/>}>
          <Route path="/play" element={<Play />} />
          <Route path="/skins" element={<Skins />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="/register" element={<Register/>} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
