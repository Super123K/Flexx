import React from "react";
import "../../assets/css/Form.css";
import { useHistory } from "react-router-dom";
const FormSuccess = () => {
  let history = useHistory();

  const click = () => {
    history.push("./login");
  };

  return (
    <div className="form-container">
      <div className="form-content-left">
        <img className="form-img" src="img/img-4.svg" alt="spaceship" />
      </div>
      <div className="form-content-right">
        <h1 className="form-success">Registered Successfully!</h1>
        <img className="form-img-3" src="img/check.png"  />

        <button className="form-input-btn2" onClick={click}>
          Goto homepage
        </button>
      </div>
    </div>
  );
};
export default FormSuccess;
