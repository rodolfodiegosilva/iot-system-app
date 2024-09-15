// src/app/models/command.model.ts

import { Parameter } from "./parameter.model";

export interface Command {
  command: string;
  parameters: Parameter[];
}
