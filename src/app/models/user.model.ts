// src/app/models/user.model.ts
export interface User {
    id: number;
    name: string;
    email: string;
    username: string;
    password: string;
    role: string;
    accountNonExpired: boolean;
    credentialsNonExpired: boolean;
    authorities: { authority: string }[];
    accountNonLocked: boolean;
    enabled: boolean;
  }
  