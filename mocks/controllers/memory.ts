import { ParsedQs } from "qs";

import { Controller } from "./interface";

export class MemoryController<Model extends { id: string } = { id: string }>
  implements Controller<Model>
{
  constructor(private load: () => Promise<{ default: Model[] }>) {}

  getId(model: Model) {
    return model.id;
  }

  async create(model: Model): Promise<Model> {
    const { default: models } = await this.load();
    models.push(model);
    return model;
  }

  async delete(id: string): Promise<void> {
    const { default: models } = await this.load();
    const index = models.findIndex((m) => this.getId(m) === id);
    if (index >= 0) {
      models.splice(index, 1);
    } else {
      throw new Error("not found");
    }
  }

  async get(id: string): Promise<Model | undefined> {
    const { default: models } = await this.load();
    const model = models.find((m) => this.getId(m) === id);
    if (model) {
      return model;
    } else {
      throw new Error("not found");
    }
  }

  async list(query?: ParsedQs): Promise<Model[]> {
    const page = Math.max(Number(query?.page) || 1, 1);
    const perPage = Math.min(Math.max(Number(query?.per_page) || 20, 5), 100);
    const { default: models } = await this.load();
    return models.slice((page - 1) * perPage, page * perPage);
  }

  async patch(id: string, model: Model): Promise<Model> {
    const { default: models } = await this.load();
    const index = models.findIndex((m) => this.getId(m) === id);
    if (index >= 0) {
      models[index] = {
        ...models[index],
        ...model,
      };
      return models[index];
    } else {
      throw new Error("not found");
    }
  }

  async update(model: Model): Promise<Model> {
    const id = this.getId(model);
    const { default: models } = await this.load();
    const index = models.findIndex((m) => this.getId(m) === id);
    if (index >= 0) {
      models[index] = model;
      return model;
    } else {
      throw new Error("not found");
    }
  }
}
