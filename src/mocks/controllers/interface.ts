import { ParsedQs } from "qs";

export interface Controller<Model> {
  create?(model: Model): Promise<Model>;
  delete?(id: string): Promise<void>;
  get?(id: string): Promise<Model | undefined>;
  getId(model: Model): string;
  list?(query?: ParsedQs): Promise<Model[]>;
  patch?(id: string, model: Partial<Model>): Promise<Model>;
  update?(model: Model): Promise<Model>;
}
