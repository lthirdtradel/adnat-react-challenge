import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import LogIn from "./components/auth/LogIn";
import Register from "./components/auth/Register";
import Home from "./components/home/Home";
import EditOrganisation from "./components/organisations/EditOrganisation";
import ViewShifts from "./components/shifts/ViewShifts";

class App extends Component {
  render() {
    return (
      <div className="">
        <div className="mx-auto h-full p-16 flex flex-col items-center justify-center">
          <Switch>
            <Route path="/" exact component={LogIn} />
            <Route path="/login" exact component={LogIn} />
            <Route path="/register" exact component={Register} />
            <Route path="/home" exact component={Home} />
            <Route
              path="/oragnisation/edit"
              exact
              component={EditOrganisation}
            />
            <Route path="/shifts" exact component={ViewShifts} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
