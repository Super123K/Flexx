export default function validateInfo(values) {
  let errors = {};

  // else if (!/^[A-Za-z]+/.test(values.name.trim())) {
  //   errors.name = 'Enter a valid name';
  // }

  if (!values.email) {
    errors.email = "Email required";
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = "Email address is invalid";
  }
  if (!values.password) {
    errors.password = "Password is required";
  } else if (values.password.length < 6) {
    errors.password = "Password needs to be 6 characters or more";
  }

  if (!values.cpassword) {
    errors.cpassword = "Password is required";
  }
  if (values.cpassword !== values.password) {
    errors.cpassword = "Passwords do not match";
  }
  if (!values.name) {
    errors.name = "Name required!";
  }
  return errors;
}
