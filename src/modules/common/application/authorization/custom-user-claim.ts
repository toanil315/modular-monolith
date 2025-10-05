export class CustomUserClaim {
  constructor(
    public identityId: string,
    public userId: string,
    public email: string,
    public firstName: string,
    public lastName: string,
    public permissions: string[],
  ) {}
}
