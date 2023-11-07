import React from "react";
import { toast } from "react-hot-toast";

import isAuthenticated from "../../services/Authentication/Authentication";
import isAuthorizated from "../../services/Authorization/Authorization";

import {
  deleteUser,
  findUser,
  findUsers,
  findUsersByName,
} from "../../services/Api/Users/UsersEndpoint";

import {
  nextPage,
  prevPage,
  goToPage,
  handleChange,
} from "../../helpers/helpers";

import Table from "../../components/Table/Table";

import "./Users.scss";
import { Redirect } from "react-router";

class Users extends React.Component<any, any> {
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
          class: "edit",
          icon: "fa fa-edit",
          func: this.findUser,
        },
        {
          class: "delete",
          icon: "fa fa-trash-can",
          func: this.deleteUser,
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

    this.findUsers(this.state.query);
  }

  findUsers = async (query: any) => {
    await findUsers(query)
      .then((res) => {
        let pages = Math.ceil(res.data.data.documents.qtd / query.limit);

        this.setState({
          users: res.data.data.users,
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

  findUser = async (userId: string) => {
    await findUser(userId)
      .then((res: any) => {
        const user = res.data.user;
        delete user.password;

        localStorage.setItem("selectedUser", JSON.stringify(res.data.user));

        this.setState({ user: user, redirectTo: "/users/edit" });
      })
      .catch((err: any) => {
        if (err.response.status === 401) {
          toast.error(err.response.data.message);
          this.setState({ redirectTo: "/login" });
          localStorage.removeItem("user");
          return;
        }

        this.setState({
          user: {},
        });

        return toast.error(err.response.data.message);
      });
  };

  findUsersByName = async (userName: string, query: any, e?: any) => {
    if (e) e.preventDefault();

    const newQuery = { ...query };
    newQuery.page = 1;

    await findUsersByName(userName, newQuery)
      .then((res) => {
        let pages = Math.ceil(res.data.data.documents.qtd / query.limit);

        this.setState({
          users: res.data.data.users,
          totalPages: pages,
          query: newQuery,
          isFiltered: true,
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
          isFiltered: true,
        });

        return toast.error(err.response.data.message);
      });
  };

  deleteUser = async (userId: string) => {
    const newUsers = this.state.users.filter(
      (user: any) => user._id !== userId
    );

    if (window.confirm("Realmente deseja excluir esse usuário?")) {
      await deleteUser(userId)
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
      await this.findUsers(this.state.query);
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

    if (this.state.isFiltered) {
      this.findUsersByName(this.state.userName, this.state.query, e);
    } else {
      await this.findUsers(query);
    }
  };

  goToPage = async (e: any) => {
    e.preventDefault();
    if (this.state.isFiltered) {
      goToPage(
        this,
        this.findUsersByName,
        +e.target.textContent,
        this.state.userName
      );
    } else {
      goToPage(this, this.findUsers, +e.target.textContent);
    }
  };

  previousPage = async (e: any) => {
    e.preventDefault();
    if (this.state.isFiltered) {
      prevPage(this, this.findUsersByName, this.state.userName);
    } else {
      prevPage(this, this.findUsers);
    }
  };

  nextPage = async (e: any) => {
    e.preventDefault();
    if (this.state.isFiltered) {
      nextPage(this, this.findUsersByName, this.state.userName);
    } else {
      nextPage(this, this.findUsers);
    }
  };

  render() {
    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo} />;
    }

    return (
      <section className="container d-flex justify-content-center col-12">
        <div className="container d-flex align-items-center flex-column">
          <div className="formUserArea container d-flex justify-content-center align-items-center mb-2">
            <form
              className="d-flex justify-content-center align-itens-center"
              onSubmit={(e) =>
                this.findUsersByName(this.state.userName, this.state.query, e)
              }
            >
              <input
                type="text"
                onChange={this.handleChange}
                name="userName"
                id="userInput"
                className="selectUser col-6 me-2 px-4 py-1"
                placeholder="Pesquisar usuário"
                required
              />

              <button
                type="submit"
                className="btn col-1 d-flex justify-content-center align-items-center"
              >
                <i className="fa fa-search" />
              </button>
            </form>
          </div>

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

export default Users;
