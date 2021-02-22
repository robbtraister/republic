import { render } from "@testing-library/react";
import { StaticRouter } from "react-router";

import { Home } from ".";

test("home page", () => {
  const { container } = render(
    <StaticRouter location="/">
      <Home />
    </StaticRouter>
  );

  expect(container).toMatchSnapshot();
});
