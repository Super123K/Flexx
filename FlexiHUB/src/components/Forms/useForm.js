import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import firebase from "../../utils/firebase";
const useForm = (callback, validate) => {
  const [values, setValues] = useState({
    email: "",
    password: "",
    name: "",
    cpassword: "",
  });

  const history = useHistory();
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setErrors(validate(values));
    firebase
      .auth()
      .signInWithEmailAndPassword(values.email, values.password)
      .then((signedInUser) => {
        alert("signed in " + signedInUser.user.email);
      })
      .catch((err) => {
        let errorMessage = err.message;
        alert(errorMessage);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors(validate(values));
    if (values.password === values.cpassword) {
      const db = firebase.firestore();
      firebase
        .auth()
        .createUserWithEmailAndPassword(values.email, values.password)
        .then((signedInUser) => {
          const currentUser = firebase.auth().currentUser;
          history.push("./success");

          db.collection("users")
            .doc(currentUser.uid)
            .set({
              s: "",
            })
            .then((docRef) => {
              //success
            })
            .catch((error) => {
              //error
            });

          db.collection("users")
            .doc(currentUser.uid)
            .collection("profile")
            .add({
              email: currentUser.email,
              name: values.name,
              img: "https://www.clipartmax.com/png/middle/257-2572603_user-man-social-avatar-profile-icon-man-avatar-in-circle.png",
            });
        })
        .catch((err) => {
          let errorMessage = err.message;
          alert(errorMessage);
        });
    }
  };

  useEffect(() => {
    if (Object.keys(errors).length === 0 && isSubmitting) {
      callback();
    }
  }, [errors]);

  return { handleChange, handleSubmit, values, errors, handleLogin };
};

export default useForm;
