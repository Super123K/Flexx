import React, { useEffect, useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import firebase from "../../utils/firebase";
import AccountCircleRoundedIcon from "@material-ui/icons/AccountCircleRounded";
import {v4 as uuid} from "uuid";
//Components
import Sidebar from "../Sidebar/Sidebar";
function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 800,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function Profile() {
  const db = firebase.firestore();
  const storage = firebase.storage();
  const currentUser = firebase.auth().currentUser;
  const [profileImg, setProfileImg] = useState("");
  const [profileName, setProfileName] = useState("");
  const [docId, setDocId] = useState("");
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

  const [preview, setPreview] = useState("");
  const [image, setImage] = useState(null);
  const fileInputRef = useRef();
  const [upload, setUpload] = useState(false);
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
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  //Modal

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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

  const saveChanges = () => {
    let myid = uuid();
    if (upload) {
      const uploadPhoto = storage
        .ref(`images-profile/${myid}`)
        .put(image);
      uploadPhoto.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          console.log(error);
        },
        () => {
          storage
            .ref("images-profile")
            .child(myid)
            .getDownloadURL()
            .then((url) => {
              const currentUser = firebase.auth().currentUser;
              db.collection("users")
                .doc(currentUser.uid)
                .collection("profile")
                .doc(docId)
                .set({
                  img: url,
                  email: currentUser.email,
                  name: profileName,
                });
              alert("Profile updated successfully");

              setOpen(false);
            });
        }
      );
    } else {
      setOpen(false);
    }
  };
  const body = (
    <div style={modalStyle} className={classes.paper}>
      <img src={preview} className="imagePreview"></img>
      <button onClick={saveChanges}>Save changes</button>
      <button onClick={handleClose}>Cancel</button>
    </div>
  );
  return (
    <div>
      <Sidebar />
      <div className="content" style={{ textAlign: "center" }}>
        <p style={{ fontSize: 30, padding: 50, fontFamily: "Stellar" }}>
          {profileName}
        </p>

        {!profileImg ? (
          <AccountCircleRoundedIcon style={{ fontSize: 600 }} />
        ) : (
          <img src={profileImg} className="imagePreviewProf"></img>
        )}
        <div className="uploadButton">
          <button
            onClick={(event) => {
              fileInputRef.current.click();
              handleOpen();
            }}
            className="upload-btn"
          >
            Upload
            <input
              type="file"
              style={{ display: "none" }}
              ref={fileInputRef}
              accept="image/*"
              onChange={previewFile}
            />
          </button>
        </div>
        {/* <button type="button" onClick={handleOpen}>
          Open Modal
        </button> */}
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          {body}
        </Modal>
      </div>
    </div>
  );
}
