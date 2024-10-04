export interface CommandDescription {
  operation: string;
  description: string;
  result: string;
  format: string;
  command: Command;
}

export interface Command {
  command: string;
  parameters: Parameter[];
}

export interface Parameter {
  name: string;
  description: string;
}
