export class Role {
  public static readonly Administrator = new Role('Administrator');
  public static readonly Member = new Role('Member');

  constructor(public readonly name: string) {}
}
