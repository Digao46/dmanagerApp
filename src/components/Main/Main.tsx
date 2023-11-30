import React from "react";
import { HashRouter, Route } from "react-router-dom";

import "./Main.scss";

import Home from "../../pages/Home/Home";

import Sales from "../../pages/Sales/Sales";
import AddSale from "../../pages/Sales/Add/AddSale";

import Storage from "../../pages/Storage/Storage";
import StorageTrash from "../../pages/Storage/Trash/StorageTrash";
import AddProduct from "../../pages/Storage/Add/AddProduct";
import EditProduct from "../../pages/Storage/Edit/EditProduct";

import Clients from "../../pages/Customers/Customers";
import ClientsTrash from "../../pages/Customers/Trash/CustomersTrash";
import AddClient from "../../pages/Customers/Add/AddCustomer";
import EditClient from "../../pages/Customers/Edit/EditCustomer";

import Users from "../../pages/Users/Users";
import UsersTrash from "../../pages/Users/Trash/UsersTrash";
import AddUser from "../../pages/Users/Add/AddUser";
import EditUser from "../../pages/Users/Edit/EditUser";

import TabCard from "../../pages/TabCard/TabCard";
import Additions from "../../pages/Additions/Additions";
import AddAddition from "../../pages/Additions/Add/AddAddition";
import AddDiscount from "../../pages/Discounts/Add/AddDiscount";
import Discounts from "../../pages/Discounts/Discounts";

import Cash from "../../pages/Cash/Cash";

class Main extends React.Component<any, any> {
  render() {
    return (
      <main className="mt-4">
        <HashRouter basename="/">
          {/* Caixa */}
          <Route path="/cash" exact>
            <Cash />
          </Route>

          {/* Usuários */}
          <Route path="/users/edit" exact>
            <EditUser />
          </Route>
          <Route path="/users/add" exact>
            <AddUser />
          </Route>
          <Route path="/users/trash" exact>
            <UsersTrash />
          </Route>
          <Route path="/users" exact>
            <Users />
          </Route>

          {/* Clientes */}
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

          {/* Estoque */}
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

          {/* Comanda */}
          <Route path="/discounts/add" exact>
            <AddDiscount />
          </Route>
          <Route path="/discounts" exact>
            <Discounts />
          </Route>
          <Route path="/additions/add" exact>
            <AddAddition />
          </Route>
          <Route path="/additions" exact>
            <Additions />
          </Route>
          <Route path={"/orders"}>
            <TabCard />
          </Route>

          {/* Vendas */}
          <Route path="/sales/add" exact>
            <AddSale />
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
