import React, { useState, useEffect, useRef } from "react";
import "../../assets/css/Share.css";
import { useHistory } from "react-router";
import firebase from "../../utils/firebase";
import { PermMedia, Label, Room, EmojiEmotions } from "@material-ui/icons";
import AccountCircleRoundedIcon from "@material-ui/icons/AccountCircleRounded";
import { v4 as uuid } from "uuid";

export default function Share() {
  //Image upload
  const [preview, setPreview] = useState("");
  const [image, setImage] = useState(null);
  const fileInputRef = useRef();

  const storage = firebase.storage();
  const [upload, setUpload] = useState(false);
  const [values, setValues] = useState({
    description: "",
    imgPost: "",
  });
  const history = useHistory();
  const currentUser = firebase.auth().currentUser;
  const [docId, setDocId] = useState("");
  const [profileImg, setProfileImg] = useState("");
  const [profileName, setProfileName] = useState("");
  useEffect(() => {
    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(image);
    } else {
      setPreview(null);
    }
  }, [image]);

  const previewFile = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setUpload(true);
    } else {
      setImage(null);
    }
  };

  const db = firebase.firestore();
  useEffect(() => {
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
      fontSize: 50,
    },
  };

  const handleChange = (prop) => (e) => {
    setValues({ ...values, [prop]: e.target.value });
  };
  useEffect(() => {
    db.collection("users")
      .doc(currentUser.uid)
      .collection("profile")
      .onSnapshot((doc) => {
        doc.forEach((c) => {
          setDocId(c.id);
        });
      });
  }, []);

  const post = (e) => {
    let myid = uuid();
    e.preventDefault();
    if (upload) {
      const uploadPhoto = storage.ref(`images-posts/${myid}`).put(image);
      uploadPhoto.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          console.log(error);
        },
        () => {
          storage
            .ref("images-posts")
            .child(myid)
            .getDownloadURL()
            .then((url) => {
              db.collection("users")
                .doc(currentUser.uid)
                .collection("post")
                .add({
                  postId: docId,
                  currentId: currentUser.uid,
                  imgProf: profileImg,
                  nameProf: profileName,
                  imgPost: url,
                  description: values.description,
                });
            });
          alert("Post Successfully Created!");
          history.push("./home");
        }
      );
    } else {
      db.collection("users").doc(currentUser.uid).collection("post").add({
        postId: docId,
        currentId: currentUser.uid,
        imgProf: profileImg,
        nameProf: profileName,
        imgPost: "",
        description: values.description,
      });
      alert("Post Successfully Created!");
      history.push("./home");
    }
  };
  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          {!profileImg ? (
            <AccountCircleRoundedIcon style={useStyle.sideProfile} />
          ) : (
            <img className="shareProfileImg" src={profileImg} alt="" />
          )}

          <input
            placeholder="What's in your mind ?"
            type="text"
            className="shareInput"
            value={values.description}
            onChange={handleChange("description")}
          />
        </div>
        <hr className="shareHr" />
        <div className="postCenter">
          {!preview ? (
            <img
              src={preview}
              className="imagePreview"
              style={{ display: "none" }}
            ></img>
          ) : (
            <img src={preview} className="imagePreview"></img>
          )}
        </div>
        <div className="shareBottom">
          <div className="shareOptions">
            <div className="shareOption">
              <PermMedia htmlColor="tomato" className="shareIcon" />
              <span
                className="shareOptionText"
                onClick={(event) => {
                  fileInputRef.current.click();
                }}
              >
                Photo or Video
                <input
                  type="file"
                  style={{ display: "none" }}
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={previewFile}
                />
              </span>
            </div>
            <div className="shareOption">
              <Label htmlColor="blue" className="shareIcon" />
              <span className="shareOptionText">Tag</span>
            </div>
            <div className="shareOption">
              <Room htmlColor="green" className="shareIcon" />
              <span className="shareOptionText">Location</span>
            </div>
            <div className="shareOption">
              <EmojiEmotions htmlColor="goldenrod" className="shareIcon" />
              <span className="shareOptionText">Feelings</span>
            </div>
          </div>
          <button className="shareButton" onClick={(e) => post(e)}>
            Share
          </button>
        </div>
      </div>
    </div>
  );
}
