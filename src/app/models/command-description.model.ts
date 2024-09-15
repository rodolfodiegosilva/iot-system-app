import { Command } from "./command.model";

// src/app/models/command-description.model.ts
export interface CommandDescription {
  operation: string;
  description: string;
  result: string;
  format: string;
  command: Command;
}
