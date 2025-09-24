export class OrderItem {
  private constructor(
    public id: string,
    public orderId: string,
    public ticketTypeId: string,
    public quantity: number,
    public unitPrice: number,
    public price: number,
    public currency: string,
  ) {}

  static create(
    orderId: string,
    ticketTypeId: string,
    quantity: number,
    unitPrice: number,
    currency: string,
  ): OrderItem {
    const id = crypto.randomUUID();
    const price = quantity * unitPrice;

    return new OrderItem(id, orderId, ticketTypeId, quantity, unitPrice, price, currency);
  }
}
