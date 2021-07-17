import React from "react";
import validate from "../validateInfo";
import useForm from "./useForm";
import "../../assets/css/Form.css";

import { useHistory } from "react-router-dom";
const FormSignup = ({ submitForm }) => {
  const { handleChange, handleSubmit, values, errors } = useForm(
    submitForm,
    validate
  );

  let history = useHistory();

  const click = () => {
    history.push("./login");
  };

  return (
    <div className="form-container">
      <div className="form-content-left">
        <img className="form-img" src="img/img-1.svg" alt="spaceship" />
      </div>
      <div className="form-content-right">
        <form onSubmit={handleSubmit} className="form" noValidate>
          <h1>
            Get started with us today! Create your account by filling out the
            information below.
          </h1>
          <div className="form-inputs">
            <label className="form-label">Name</label>
            <input
              className="form-input"
              type="text"
              name="name"
              placeholder="Enter your Full name"
              value={values.name}
              onChange={handleChange}
            />
            {errors.name && <p>{errors.name}</p>}
          </div>
          <div className="form-inputs">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={values.email}
              onChange={handleChange}
            />
            {errors.email && <p>{errors.email}</p>}
          </div>
          <div className="form-inputs">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={values.password}
              onChange={handleChange}
            />
            {errors.password && <p>{errors.password}</p>}
          </div>

          <div className="form-inputs">
            <label className="form-label">Confirm Password</label>
            <input
              className="form-input"
              type="password"
              name="cpassword"
              placeholder="Confirm your password"
              value={values.cpassword}
              onChange={handleChange}
            />
            {errors.cpassword && <p>{errors.cpassword}</p>}
          </div>

          <button
            className="form-input-btn"
            type="submit"
            onClick={handleSubmit}
          >
            Sign up
          </button>
          <span className="form-input-login">
            Already have an account? &nbsp;&nbsp;
            <a onClick={click} style={{ cursor: "pointer" }}>
              Login here
            </a>
          </span>
        </form>
      </div>
    </div>
  );
};

export default FormSignup;
