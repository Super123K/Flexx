import React, { useState, useEffect } from "react";
import "../../assets/css/Sidebar.css";
import AccountCircleRoundedIcon from "@material-ui/icons/AccountCircleRounded";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { SidebarData } from "./SidebarData";
import firebase from "../../utils/firebase";
export default function Sidebar() {
  const [profileImg, setProfileImg] = useState("");
  const [profileName, setProfileName] = useState("");
  const signout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        alert("Successfully logged out!");
      })
      .catch((error) => {
        // An error happened.
      });
  };

  const db = firebase.firestore();
  useEffect(() => {
    var currentUser = firebase.auth().currentUser;
    const fetchData = () => {
      db.collection("users")
        .doc(currentUser.uid)
        .collection("profile")
        .onSnapshot((doc) => {
          doc.forEach((c) => {
            setProfileImg(c.data().img);
            setProfileName(c.data().name);
          });
        });
    };
    fetchData();
  }, []);
  const useStyle = {
    sideProfile: {
      fontSize: 150,
    },
    container: {
      textAlign: "center",
    },
  };
  return (
    <div className="container">
      <div className="Sidebar">
        <div style={useStyle.container}>
          {!profileImg ? (
            <AccountCircleRoundedIcon style={useStyle.sideProfile} />
          ) : (
            <img src={profileImg} className="sideProfile"></img>
          )}
        </div>
        <div className="SidebarText">
          <p>{profileName}</p>
        </div>

        <ul className="SidebarList">
          {SidebarData.map((val, key) => {
            return (
              <li
                key={key}
                className="row"
                id={window.location.pathname === val.link ? "active" : ""}
                onClick={() => {
                  window.location.pathname = val.link;
                }}
              >
                <div id="icon">{val.icon} </div>{" "}
                <div id="title">{val.title}</div>
              </li>
            );
          })}
          <li className="row" onClick={signout}>
            <div id="icon">
              <ExitToAppIcon />
            </div>{" "}
            <div id="title">Logout</div>
          </li>
        </ul>
      </div>
    </div>
  );
}
