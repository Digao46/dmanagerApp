import React from "react";
import { Redirect } from "react-router";

import isAuthenticated from "../../services/Authentication/Authentication";
import isAuthorizated from "../../services/Authorization/Authorization";

import HomeCard from "../../components/HomeCard/HomeCard";

class Home extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      redirectTo: null,
    };
  }

  componentDidMount(): void {
    if (!isAuthenticated()) {
      window.alert("Sessão Expirada. Por favor efetue o login novamente!");
      this.setState({ redirectTo: "/login" });
    }
  }

  render() {
    if (this.state.redirectTo) return <Redirect to={this.state.redirectTo} />;

    return (
      <section className="container d-flex align-items center justify-content-around">
        <HomeCard
          title={"Vendas"}
          link={"/sales"}
          icon={"fa fa-dollar-sign"}
          class={"sales"}
        />
        <HomeCard
          title={"Estoque"}
          link={"/storage"}
          icon={"fa fa-warehouse"}
          class={"storage"}
        />
        {isAuthorizated() && (
          <HomeCard
            title={"Caixa"}
            link={"/cash"}
            icon={"fa fa-cash-register"}
            class={"cash"}
          />
        )}
      </section>
    );
  }
}

export default Home;
