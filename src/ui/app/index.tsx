import debug from "debug";
import { useEffect } from "react";

const log = debug("app");

export function App() {
  useEffect(() => {
    window
      .fetch("/api/v1/posts")
      .then((resp) => resp.json())
      .then(log);
  }, []);

  return <div>Hello, world!</div>;
}

export default App;
