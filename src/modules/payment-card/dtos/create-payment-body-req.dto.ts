export class CreatePaymentBodyReqDto {
  token: string;

  payment_method_id: string;

  transaction_amount: number;

  installments: number;

  description: string;

  payer: PayerBodyReqDto;
}

class PayerBodyReqDto {
  email: string;
  identification: IdentificationBodyReqDto;
}

class IdentificationBodyReqDto {
  type: string;
  number: string;
}
