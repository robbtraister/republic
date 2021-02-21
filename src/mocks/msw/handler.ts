import { rest, MockedRequest, ResponseComposition, RestContext } from "msw";

import { Controller } from "../controllers";

export function handleResource<Model>(
  controller: Controller<Model>,
  endpoint: string
) {
  const update = async (
    req: MockedRequest,
    res: ResponseComposition,
    ctx: RestContext
  ) => {
    if (controller.update) {
      try {
        const model = await controller.update(JSON.stringify(req.body) as any);
        return res(ctx.json(model));
      } catch {
        return res(ctx.status(400));
      }
    } else {
      return res(ctx.status(405));
    }
  };

  return [
    // list
    rest.get(endpoint, async (req, res, ctx) => {
      if (controller.list) {
        const query = [...req.url.searchParams.entries()].reduce(
          (acc, [key, value]) => ({ ...acc, [key]: value }),
          {}
        );
        return res(ctx.json(await controller.list(query)));
      } else {
        return res(ctx.status(405));
      }
    }),

    // create
    rest.post(endpoint, async (req, res, ctx) => {
      if (controller.create) {
        try {
          const model = await controller.create(
            JSON.stringify(req.body) as any
          );
          return res(ctx.json(model));
        } catch {
          return res(ctx.status(400));
        }
      } else {
        return res(ctx.status(405));
      }
    }),

    // get
    rest.get(`${endpoint}/:id`, async (req, res, ctx) => {
      if (controller.get) {
        return res(ctx.json(await controller.get(req.params.id)));
      } else {
        return res(ctx.status(405));
      }
    }),

    // delete
    rest.delete(`${endpoint}/:id`, async (req, res, ctx) => {
      if (controller.delete) {
        try {
          await controller.delete(req.params.id);
          return res(ctx.status(204));
        } catch {
          return res(ctx.status(400));
        }
      } else {
        return res(ctx.status(405));
      }
    }),

    // patch
    rest.patch(`${endpoint}/:id`, async (req, res, ctx) => {
      if (controller.patch) {
        try {
          const model = await controller.patch(
            req.params.id,
            JSON.stringify(req.body) as any
          );
          return res(ctx.json(model));
        } catch {
          return res(ctx.status(400));
        }
      } else {
        return res(ctx.status(405));
      }
    }),

    // update
    rest.post(`${endpoint}/:id`, update),
    rest.put(`${endpoint}/:id`, update),
  ];
}
