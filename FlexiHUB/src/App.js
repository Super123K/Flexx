import React, { useState, useEffect } from "react";
import "./App.css";
import Form from "./components/Forms/Form";
import Login from "./components/Forms/FormLogin";
import FormSuccess from "./components/Forms/FormSuccess";
import Home from "./components/Pages/Home";
import Post from "./components/Pages/Post";
import Profile from "./components/Pages/Profile";
import firebase from "./utils/firebase";
import PrivateRoute from "./routers/PrivateRoute";
import PublicRoute from "./routers/PublicRoute";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

function App() {
  const [state, setState] = useState({
    isAuth: false,
    isLoading: true,
  });
  useEffect(() => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        setState({ isAuth: true, isLoading: false });
      } else {
        setState({ isAuth: false, isLoading: false });
      }
    });
  }, []);

  if (state.isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <Redirect to="/login" />
        </Route>
        <PrivateRoute
          component={Home}
          isAuth={state.isAuth}
          path="/home"
          exact
        />{" "}
        <PrivateRoute
          component={Post}
          isAuth={state.isAuth}
          path="/post"
          exact
        />{" "}
        <PrivateRoute
          component={Profile}
          isAuth={state.isAuth}
          path="/Profile"
          exact
        />
        <PublicRoute
          component={Login}
          isAuth={state.isAuth}
          restricted={true}
          path="/login"
          exact
        />
        <PublicRoute
          component={Form}
          isAuth={state.isAuth}
          restricted={true}
          path="/form"
          exact
        />{" "}
        <Route component={FormSuccess} path="/success" exact />
      </Switch>
    </Router>
  );
}

export default App;
