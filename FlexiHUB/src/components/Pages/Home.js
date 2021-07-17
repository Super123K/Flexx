import React, { useState, useEffect } from "react";

import Share from "./Share";
import Post from "./Post";
import firebase from "../../utils/firebase";
import "../../App.css";

//Components
import Sidebar from "../Sidebar/Sidebar";

const db = firebase.firestore();
const Home = () => {
  const [postData, setPostData] = useState([]);

  useEffect(() => {
    let foundContents = [];
    const fetchData = () => {
      db.collection("users").onSnapshot((doc) => {
        doc.forEach((user) => {
          db.collection("users")
            .doc(user.id)
            .collection("post")
            .onSnapshot((doc) => {
              doc.forEach((c) => {
                foundContents.push({ ...c.data(), id: c.id });
                console.log(c.data());
                // console.log(c.id)
              });
              let check = {};
              let res = [];
              for (let i = 0; i < foundContents.length; i++) {
                if (!check[foundContents[i]["description"]]) {
                  check[foundContents[i]["description"]] = true;
                  res.push(foundContents[i]);
                }
              }
              setPostData(res);
              // console.log(res);
            });
        });
      });
    };
    fetchData();
  }, []);

  return (
    <div>
      <Sidebar />
      <div className="content">
        <center>
          <Share />

          {postData.map((item, key) => (
            <Post key={key} item={item} />
          ))}
        </center>
      </div>
    </div>
  );
};

export default Home;
