import "../../assets/css/Post.css";
import { useState, useEffect } from "react";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";
import DeleteIcon from "@material-ui/icons/Delete";

import AccountCircleRoundedIcon from "@material-ui/icons/AccountCircleRounded";
import firebase from "../../utils/firebase";
import { Alert } from "reactstrap";
export default function Post(props) {
  const [like, setLike] = useState(0);
  const [countLike, setCountLike] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [commentVisible, setCommentVisible] = useState("0");

  // const likehandler = () => {
  //   setLike(isLiked ? like - 1 : like + 1);
  //   setIsLiked(!isLiked);
  // };

  const [postData, setPostData] = useState([]);
  const [postComments, setPostComments] = useState([]);
  const db = firebase.firestore();
  const currentUser = firebase.auth().currentUser;

  const [profileImage, setProfileImg] = useState("");
  const [profileName, setProfileName] = useState("");
  const [getId, setPostId] = useState("");
  // const [postId, setPostId] = useState("");

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

  useEffect(() => {
    let count = 0;
    db.collection("users").onSnapshot((doc) => {
      doc.forEach((user) => {
        db.collection("users")
          .doc(user.id)
          .collection("post")
          .doc(props.item.id)
          .collection("likes")
          .onSnapshot((doc) => {
            doc.forEach((c) => {
              if (currentUser.uid === c.data().like_id) {
                setIsLiked(true);
              }
              count++;
            });
            setCountLike(count);
          });
      });
    });
  }, [isLiked]);

  // useEffect(() => {
  //   db.collection("users").onSnapshot((doc) => {
  //     doc.forEach((user) => {
  //       db.collection("users")
  //         .doc(user.id)
  //         .collection("posts")
  //         .doc(props.item.id)
  //         .collection("likes")
  //         .onSnapshot((doc) => {
  //           doc.forEach((c) => {
  //             if (currentUser.uid === c.data().like_id) {
  //               setIsLiked(true);
  //             }
  //           });
  //         });
  //     });
  //   });
  // }, []);

  const setlike = (user_id) => {
    db.collection("users")
      .doc(user_id)
      .collection("post")
      .doc(props.item.id)
      .collection("likes")
      .add({
        like_id: currentUser.uid,
        like_photo: profileImage,
        like_username: profileName,
      })
      .then((docRef) => {
        //success
        setIsLiked(true);
        // setLikeDetails([]);
      })
      .catch((err) => {
        //error
      });
  };

  const unlike = (user_id) => {
    db.collection("users").onSnapshot((doc) => {
      doc.forEach((user) => {
        db.collection("users")
          .doc(user.id)
          .collection("post")
          .doc(props.item.id)
          .collection("likes")
          .get()
          .then((doc) => {
            doc.forEach((c) => {
              db.collection("users")
                .doc(user.id)
                .collection("post")
                .doc(props.item.id)
                .collection("likes")
                .doc(c.id)
                .delete()
                .then(() => {
                  //success
                  setIsLiked(false);
                })
                .catch((error) => {
                  //error
                });
              // return;
            });
          });
      });
    });
  };

  // useEffect(() => {
  //   let foundContents = [];
  //   const fetchData = () => {
  //     db.collection("users").onSnapshot((doc) => {
  //       doc.forEach((user) => {
  //         db.collection("users")
  //           .doc(user.id)
  //           .collection("post")
  //           .onSnapshot((doc) => {
  //             doc.forEach((c) => {
  //               foundContents.push({ ...c.data(), id: c.id });
  //               console.log(c.data());
  //             });
  //             let check = {};
  //             let res = [];
  //             for (let i = 0; i < foundContents.length; i++) {
  //               if (!check[foundContents[i]["description"]]) {
  //                 check[foundContents[i]["description"]] = true;
  //                 res.push(foundContents[i]);
  //               }
  //             }
  //             setPostData(res);
  //             console.log(res);
  //           });
  //       });
  //     });
  //   };
  //   fetchData();
  // }, []);

  const [values, setValues] = useState({
    message: "",
  });
  const handleChange = (prop) => (e) => {
    setValues({ ...values, [prop]: e.target.value });
  };
  const postComment = (currentId, postId) => {
    // alert(currentId)
    // alert(postId)
    db.collection("users")
      .doc(currentId)
      .collection("post")
      .doc(postId)
      .collection("comments")
      .add({
        commentMessage: values.message,
        commentorId: currentId,
        commentorName: profileName,
        commentPhoto: profileImage,
      });
    alert("Sucess");
    setValues({ message: "" });
    // setPostId(postId);
  };

  // useEffect(() => {
  //   let foundComments = [];
  //   const fetchData = () => {
  //     db.collection("users").onSnapshot((doc) => {
  //       doc.forEach((user) => {
  //         db.collection("users")
  //           .doc(user.id)
  //           .collection("posts")
  //           .doc(getId)
  //           .collection("comments")
  //           .onSnapshot((doc) => {
  //             doc.forEach((c) => {
  //               foundComments.push({ ...c.data(), id: c.id });
  //             });
  //             console.log(foundComments);
  //           });
  //       });
  //     });
  //   };
  //   fetchData();
  // }, []);

  const showComments = (postId) => {
    db.collection("users").onSnapshot((doc) => {
      doc.forEach((user) => {
        db.collection("users")
          .doc(user.id)
          .collection("post")
          .doc(postId)
          .collection("comments")
          .onSnapshot((doc) => {
            let foundComments = postComments || [];
            doc.forEach((c) => {
              foundComments.push({ ...c.data(), id: c.id });
              console.log(c.data());
            });
            let check = {};
            let resComments = [];
            for (let i = 0; i < foundComments.length; i++) {
              if (!check[foundComments[i]["commentMessage"]]) {
                check[foundComments[i]["commentMessage"]] = true;
                resComments.push(foundComments[i]);
              }
            }
            setPostComments(resComments);
            console.log(resComments);
            setCommentVisible("1");
          });
      });
    });
  };

  return (
    <div>
      <div className="post">
        <div className="postWrapper">
          <div className="postTop">
            <div className="postTopLeft">
              <img className="postProfileImg" src={props.item.imgProf} alt="" />
              <span className="postUsername">{props.item.nameProf}</span>
            </div>
            <div className="postTopRight">
              <DeleteIcon />
            </div>
          </div>
          <div className="postCenter">
            <span className="postText">{props.item.description}</span>
            <img className="postImg" src={props.item.imgPost} alt="" />
          </div>
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <p className="icons">
              {!isLiked ? (
                <FavoriteBorderIcon
                  fontSize={"large"}
                  size={24}
                  color="#4cb138"
                  style={{ cursor: "pointer" }}
                  onClick={(e) => {
                    e.preventDefault();
                    setlike(props.item.currentId);
                  }}
                />
              ) : (
                <FavoriteIcon
                  fontSize={"large"}
                  color="#4cb138"
                  style={{ cursor: "pointer" }}
                  onClick={(e) => {
                    e.preventDefault();
                    unlike(props.item.currentId);
                  }}
                />
              )}
            </p>

            <span className="postLikeCounter">{countLike} people like it</span>
          </div>
          <div className="postBottomRight">
            <span
              className="postCommentText"
              onClick={() => {
                if (commentVisible === "1") {
                  setCommentVisible("0");
                  setPostComments([]);
                } else {
                  showComments(props.item.id);
                }
              }}
            >
              Comments
            </span>
          </div>
        </div>
        <div className="postComment">
          {!profileImage ? (
            <AccountCircleRoundedIcon style={{ fontSize: 40 }} />
          ) : (
            <img src={profileImage} className="postProfileImg"></img>
          )}
          <input
            id="myInput"
            type="text"
            placeholder="Write something"
            className="inputComment"
            values={values.message}
            onChange={handleChange("message")}
          />
          <button
            className="commentBtn"
            onClick={() => {
              postComment(props.item.currentId, props.item.id);
              document.getElementById("myInput").value = "";
            }}
          >
            Comment
          </button>
        </div>
        {commentVisible === "1" ? (
          postComments.map((item, key) => {
            return (
              <div className="postCommentSection">
                <img
                  className="postProfileComment"
                  src={item.commentPhoto}
                  alt=""
                />
                &nbsp;&nbsp;
                <h5>{item.commentorName} : </h5>
                <p>&nbsp;{item.commentMessage}</p>
              </div>
            );
          })
        ) : (
          <div className="postCommentSection" style={{ display: "none" }}></div>
        )}
      </div>
    </div>
  );
}
