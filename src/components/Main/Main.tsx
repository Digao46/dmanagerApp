import React from "react";
import { HashRouter, Route, Link } from "react-router-dom";

import "./Main.scss";

import Home from "../../pages/Home/Home";

class Main extends React.Component<any, any> {
  render() {
    return (
      <main className="mt-4">
        <HashRouter basename="/">
          <Route path="/" exact>
            <Home />
          </Route>
        </HashRouter>
      </main>
    );
  }
}

export default Main;
