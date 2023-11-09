import React from "react";
import { toast } from "react-hot-toast";

import isAuthenticated from "../../../services/Authentication/Authentication";
import isAuthorizated from "../../../services/Authorization/Authorization";

import {
  findDeletedUsers,
  restoreUser,
} from "../../../services/Api/Users/UsersEndpoint";

import {
  nextPage,
  prevPage,
  goToPage,
  handleChange,
} from "../../../helpers/helpers";

import Table from "../../../components/Table/Table";

import "./UsersTrash.scss";
import { Redirect } from "react-router";

class UsersTrash extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      // pagination
      perPage: [12, 25, 50, 100, 200],
      totalPages: 0,
      query: {
        limit: 12,
        page: 1,
        orderBy: JSON.stringify([{ field: "name", direction: "asc" }]),
        where: JSON.stringify({}),
      },

      users: [],
      user: {},
      userName: "",

      content: [
        {
          head: "Nome de Usuário",
          field: "username",
          authorizated: isAuthorizated(),
        },
        { head: "Nome", field: "name", authorizated: isAuthorizated() },
        { head: "Admin", field: "isAdmin", authorizated: isAuthorizated() },
        {
          head: "Membro desde:",
          field: "createdAt",
          type: "date",
          authorizated: isAuthorizated(),
        },
      ],
      actions: [
        {
          class: "restore",
          icon: "fa fa-trash-can-arrow-up",
          func: this.restoreUser,
        },
      ],

      isFiltered: false,

      redirectTo: null,
    };
  }

  componentDidMount(): void {
    if (!isAuthenticated()) {
      window.alert("Sessão Expirada. Por favor efetue o login novamente!");
      this.setState({ redirectTo: "/login" });
    }

    this.findDeletedUsers(this.state.query);
  }

  findDeletedUsers = async (query: any) => {
    await findDeletedUsers(query)
      .then((res) => {
        let pages = Math.ceil(res.data.data.documents.qtd / query.limit);

        this.setState({
          users: res.data.data.users,
          totalDocs: res.data.data.documents.qtd,
          totalPages: pages,
        });
      })
      .catch((err: any) => {
        if (err.response.status === 401) {
          toast.error(err.response.data.message);

          this.setState({ redirectTo: "/login" });

          localStorage.removeItem("user");

          return;
        }

        this.setState({
          users: [],
          totalPages: 1,
        });

        return toast.error(err.response.data.message);
      });
  };

  restoreUser = async (userId: string) => {
    const newUsers = this.state.users.filter(
      (user: any) => user._id !== userId
    );

    if (window.confirm("Realmente deseja restaurar esse usuário?")) {
      await restoreUser(userId)
        .then((res: any) => {
          toast.success(res.data.message);
          this.syncUsersAfterDeleting(newUsers);
        })
        .catch((err: any) => {
          if (err.response.status === 401) {
            toast.error(err.response.data.message);
            this.setState({ redirectTo: "/login" });
            localStorage.removeItem("user");
            return;
          }

          return toast.error(err.response.data.message);
        });
    }
  };

  syncUsersAfterDeleting = (newUsers: any) => {
    this.setState({ users: newUsers });
  };

  handleChange = async (e: any) => {
    if (this.state.isFiltered) {
      await this.findDeletedUsers(this.state.query);
      this.setState({ isFiltered: false });
    }

    handleChange(this, e);
  };

  handleLimitChange = async (e: any) => {
    e.preventDefault();

    const query = { ...this.state.query };

    query.limit = e.target.value;
    query.page = 1;

    this.setState({ query: query });

    await this.findDeletedUsers(query);
  };

  goToPage = async (e: any) => {
    e.preventDefault();
    if (this.state.isFiltered) {
      goToPage(
        this,
        this.findDeletedUsers,
        +e.target.textContent,
        this.state.userName
      );
    } else {
      goToPage(this, this.findDeletedUsers, +e.target.textContent);
    }
  };

  previousPage = async (e: any) => {
    e.preventDefault();
    if (this.state.isFiltered) {
      prevPage(this, this.findDeletedUsers, this.state.userName);
    } else {
      prevPage(this, this.findDeletedUsers);
    }
  };

  nextPage = async (e: any) => {
    e.preventDefault();
    if (this.state.isFiltered) {
      nextPage(this, this.findDeletedUsers, this.state.userName);
    } else {
      nextPage(this, this.findDeletedUsers);
    }
  };

  render() {
    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo} />;
    }

    return (
      <section className="container d-flex justify-content-center col-12">
        <div className="container d-flex align-items-center flex-column">
          <div className="tableArea d-flex justify-content-center align-items-center my-2 col-12">
            <Table
              content={this.state.content}
              data={this.state.users}
              actions={this.state.actions}
              previousPage={this.previousPage}
              nextPage={this.nextPage}
              goToPage={this.goToPage}
              handleLimitChange={this.handleLimitChange}
              state={this.state}
            />
          </div>
        </div>
      </section>
    );
  }
}

export default UsersTrash;
