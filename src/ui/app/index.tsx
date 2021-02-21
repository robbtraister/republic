import { Redirect, Route, Switch } from "react-router-dom";

import { Pages } from "../pages";

const PATH_PREFIX = process.env.PATH_PREFIX || "";

function RedirectHandler() {
  const params = new URLSearchParams(window.location.search);
  const uri = params.get("uri") || "/";
  const to = uri?.startsWith(PATH_PREFIX) ? uri.replace(PATH_PREFIX, "") : uri;

  return <Redirect to={to} />;
}

export function App() {
  return (
    <Switch>
      <Route path="/redirect" exact component={RedirectHandler} />
      <Route component={Pages} />
    </Switch>
  );
}

export default App;
