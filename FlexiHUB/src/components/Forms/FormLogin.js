import React from "react";
import "../../assets/css/Form.css";
import { useHistory } from "react-router-dom";
import validate from "../validateInfo";
import useForm from "./useForm";

const FormLogin = ({ submitForm }) => {
  let history = useHistory();

  const { handleChange, handleLogin, values, errors } = useForm(
    submitForm,
    validate
  );

  const click = () => {
    history.push("./form");
  };
  return (
    <div className="form-container">
      <div className="form-content-left">
        <img className="form-img" src="img/img-3.svg" alt="spaceship" />
      </div>
      <div className="form-content-right">
        {/* <form onSubmit={handleSubmit} className="form" noValidate> */}
        <form className="form" noValidate>
          <h1 style={{ textAlign: "center"  }}>
            <img src="img/flexihub.png" />
          </h1>

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
          <button
            className="form-input-btn"
            type="submit"
            onClick={handleLogin}
          >
            Login
          </button>
          <span className="form-input-login">
            Doesn't have an account yet?{" "}
            <a onClick={click} style={{ cursor: "pointer" }}>
              Sign up here
            </a>
          </span>
        </form>
      </div>
    </div>
  );
};

export default FormLogin;
