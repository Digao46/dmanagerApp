import React from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Login from "./pages/Login/Login";

import Header from "./components/Header/Header";

import "./assets/scss/globals.scss";

class App extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = {
      title: "Início",
    };
  }

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

                {/* <Nav /> */}

                {/* <Main setTitle={this.setTitle} state={this.state} /> */}

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
