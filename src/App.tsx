import React from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Login from "./pages/Login/Login";

import "./assets/scss/globals.scss";

import Header from "./components/Header/Header";
import Main from "./components/Main/Main";

class App extends React.Component {
  render() {
    return (
      <HashRouter>
        <div className="App">
          <Switch>
            <Route path="/login">
              <Login />

              <Toaster />
            </Route>

            <Route path="/">
              <div className="interface">
                <Header />
                <Main />

                <Toaster />
              </div>
            </Route>
          </Switch>
        </div>
      </HashRouter>
    );
  }
}

export default App;
