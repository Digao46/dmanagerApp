import React from "react";
import { HashRouter, Route } from "react-router-dom";

import "./Main.scss";

import Home from "../../pages/Home/Home";
import Sales from "../../pages/Sales/Sales";

class Main extends React.Component<any, any> {
  render() {
    return (
      <main className="mt-4">
        <HashRouter basename="/">
          <Route path="/sales">
            <Sales />
          </Route>
          <Route path="/" exact>
            <Home />
          </Route>
        </HashRouter>
      </main>
    );
  }
}

export default Main;
