import React from "react";
import "./App.css";
import Order from "./pages/Order";
import OrderDetail from "./pages/OrderDetail";
import { Switch, Redirect, Route } from "react-router-dom";

function App(props) {
  console.log("props", props);
  return (
    <div className="App">
      <Switch>
        <Route exact path="/" component={Order} />
        <Route exact path="/order" component={Order} />
        <Route exact path="/order/:id" component={OrderDetail} />
        <Redirect to="/order" />
      </Switch>
    </div>
  );
}

export default App;
