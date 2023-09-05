import React from "react";

import HomeCard from "../../components/HomeCard/HomeCard";

class Home extends React.Component<any, any> {
  render() {
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
        <HomeCard
          title={"Caixa"}
          link={"/cash"}
          icon={"fa fa-cash-register"}
          class={"cash"}
        />
      </section>
    );
  }
}

export default Home;
