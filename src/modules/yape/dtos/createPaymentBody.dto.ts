interface ICreatePaymentBodyDto {
  token: string;
  transaction_amount: number;
  description: string;
  installments: number;
  payment_method_id: string;
  payer: ICreatePaymentPayerBodyDto;
}

interface ICreatePaymentPayerBodyDto {
  email: string;
}

export default ICreatePaymentBodyDto;
