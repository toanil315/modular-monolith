export class Permission {
  public static readonly GetUser = new Permission('users:read');
  public static readonly ModifyUser = new Permission('users:update');
  public static readonly GetEvents = new Permission('events:read');
  public static readonly SearchEvents = new Permission('events:search');
  public static readonly ModifyEvents = new Permission('events:update');
  public static readonly GetTicketTypes = new Permission('ticket-types:read');
  public static readonly ModifyTicketTypes = new Permission('ticket-types:update');
  public static readonly GetCategories = new Permission('categories:read');
  public static readonly ModifyCategories = new Permission('categories:update');
  public static readonly GetCart = new Permission('carts:read');
  public static readonly AddToCart = new Permission('carts:add');
  public static readonly RemoveFromCart = new Permission('carts:remove');
  public static readonly GetOrders = new Permission('orders:read');
  public static readonly CreateOrder = new Permission('orders:create');
  public static readonly GetTickets = new Permission('tickets:read');
  public static readonly CheckInTicket = new Permission('tickets:check-in');
  public static readonly GetEventStatistics = new Permission('event-statistics:read');

  private constructor(public readonly code: string) {}
}
