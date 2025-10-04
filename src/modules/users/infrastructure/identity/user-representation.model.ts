export class CredentialRepresentation {
  constructor(
    public type: string,
    public value: string,
    public temporary: boolean,
  ) {}
}

export class UserRepresentation {
  constructor(
    public username: string,
    public email: string,
    public firstName: string,
    public lastName: string,
    public emailVerified: boolean,
    public enabled: boolean,
    public credentials: CredentialRepresentation[],
  ) {}
}
