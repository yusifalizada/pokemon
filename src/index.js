import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { App, Profile } from "./App";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import * as serviceWorker from "./serviceWorker";

const routes = (
  <Router>
    <Switch>
      <Route path="/profile/:id" component={Profile}></Route>
      <Route path="/page/:id" component={App}></Route>
      <Route path="/" component={App}></Route>
    </Switch>
  </Router>
);

ReactDOM.render(routes, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
