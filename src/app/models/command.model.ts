// src/app/models/command.model.ts

import { Parameter } from "./parameter.model";

export interface Command {
  id: number;
  command: string;
  parameters: Parameter[];
}
