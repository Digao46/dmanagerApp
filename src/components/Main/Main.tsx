import React from "react";
import { HashRouter, Route } from "react-router-dom";

import "./Main.scss";

import Home from "../../pages/Home/Home";

import Sales from "../../pages/Sales/Sales";
import SalesOpened from "../../pages/SalesOpened/SalesOpened";
import AddSale from "../../pages/AddSale/AddSale";

import Storage from "../../pages/Storage/Storage";
import StorageTrash from "../../pages/StorageTrash/StorageTrash";
import AddProduct from "../../pages/AddProduct/AddProduct";
import EditProduct from "../../pages/EditProduct/EditProduct";

import Clients from "../../pages/Customers/Customer";
import ClientsTrash from "../../pages/CustomersTrash/CustomerTrash";
import AddClient from "../../pages/AddCustomer/AddCustomer";
import EditClient from "../../pages/EditCustomer/EditCostumer";

class Main extends React.Component<any, any> {
  render() {
    return (
      <main className="mt-4">
        <HashRouter basename="/">
          <Route path="/clients/edit" exact>
            <EditClient />
          </Route>
          <Route path="/clients/add" exact>
            <AddClient />
          </Route>
          <Route path="/clients/trash" exact>
            <ClientsTrash />
          </Route>
          <Route path="/clients" exact>
            <Clients />
          </Route>

          <Route path="/storage/edit" exact>
            <EditProduct />
          </Route>
          <Route path="/storage/add" exact>
            <AddProduct />
          </Route>
          <Route path="/storage/trash" exact>
            <StorageTrash />
          </Route>
          <Route path="/storage" exact>
            <Storage />
          </Route>

          <Route path="/sales/add" exact>
            <AddSale />
          </Route>
          <Route path="/sales/opened" exact>
            <SalesOpened />
          </Route>
          <Route path="/sales" exact>
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
