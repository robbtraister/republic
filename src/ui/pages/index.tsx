import { Redirect, Route, Switch } from "react-router-dom";

import { Home } from "./home";

export function Pages() {
  return (
    <Switch>
      <Route path="/" exact component={Home} />
      <Redirect to="/" />
    </Switch>
  );
}

export default Pages;
