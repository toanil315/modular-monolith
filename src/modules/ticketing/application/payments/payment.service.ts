import { Injectable } from '@nestjs/common';
import { v4 as uuidV4 } from 'uuid';

@Injectable()
export class PaymentService {
  constructor() {}

  async charge(amount: number, currency: string) {
    return new PaymentResponse(uuidV4(), amount, currency);
  }

  async refund(transactionId: string, amount: number) {
    return;
  }
}

export class PaymentResponse {
  constructor(
    public readonly id: string,
    public readonly amount: number,
    public readonly currency: string,
  ) {}
}
