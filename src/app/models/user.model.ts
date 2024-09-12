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

export interface SimpleUser {
  username: string;
  email: string;
}
