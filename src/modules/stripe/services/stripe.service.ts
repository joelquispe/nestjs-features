import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import Stripe from 'stripe';
import configuration from 'src/config/configuration';
import { plainToInstance } from 'class-transformer';
import {
  CreatePaymentIntentReqDto,
  CreateCheckoutSessionReqDto,
  PaymentIntentRespDto,
  CheckoutSessionRespDto,
  ConfirmPaymentReqDto,
  CreatePaymentMethodReqDto,
  PaymentMethodRespDto,
  AttachPaymentMethodReqDto,
  ListPaymentMethodsReqDto,
  PaymentMethodsListRespDto,
  UpdatePaymentMethodReqDto,
} from '../dtos';

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;
  private readonly logger = new Logger(StripeService.name);

  constructor(
    @Inject(configuration.KEY)
    private readonly config: ConfigType<typeof configuration>,
  ) {
    this.stripe = new Stripe(this.config.stripe.secretKey, {
      apiVersion: '2025-05-28.basil',
    });
  }

  /**
   * Create a Payment Intent for processing payments
   */
  async createPaymentIntent(
    dto: CreatePaymentIntentReqDto,
  ): Promise<PaymentIntentRespDto> {
    try {
      // First, create or retrieve customer
      const customer = await this.createOrRetrieveCustomer(
        dto.customerEmail,
        dto.customerName,
      );

      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: dto.amount,
        currency: dto.currency.toLowerCase(),
        customer: customer.id,
        description: dto.description,
        metadata: dto.metadata || {},
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return plainToInstance(PaymentIntentRespDto, paymentIntent, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      this.logger.error('Error creating payment intent:', error);
      throw new BadRequestException(
        `Failed to create payment intent: ${error.message}`,
      );
    }
  }

  /**
   * Create a Checkout Session for hosted checkout
   */
  async createCheckoutSession(
    dto: CreateCheckoutSessionReqDto,
  ): Promise<CheckoutSessionRespDto> {
    try {
      // Create or retrieve customer
      const customer = await this.createOrRetrieveCustomer(dto.customerEmail);

      // Transform line items to Stripe format
      const lineItems = dto.lineItems.map((item) => ({
        price_data: {
          currency: dto.currency.toLowerCase(),
          product_data: {
            name: item.name,
            description: item.description,
            images: item.images || [],
          },
          unit_amount: item.price,
        },
        quantity: item.quantity,
      }));

      const session = await this.stripe.checkout.sessions.create({
        customer: customer.id,
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: dto.successUrl,
        cancel_url: dto.cancelUrl,
        metadata: dto.metadata || {},
        billing_address_collection: 'required',
        shipping_address_collection: {
          allowed_countries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'ES', 'IT'],
        },
      });

      return plainToInstance(CheckoutSessionRespDto, session, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      this.logger.error('Error creating checkout session:', error);
      throw new BadRequestException(
        `Failed to create checkout session: ${error.message}`,
      );
    }
  }

  /**
   * Confirm a Payment Intent
   */
  async confirmPayment(dto: ConfirmPaymentReqDto): Promise<PaymentIntentRespDto> {
    try {
      const confirmOptions: Stripe.PaymentIntentConfirmParams = {};

      if (dto.paymentMethodId) {
        confirmOptions.payment_method = dto.paymentMethodId;
      }

      if (dto.returnUrl) {
        confirmOptions.return_url = dto.returnUrl;
      }

      const paymentIntent = await this.stripe.paymentIntents.confirm(
        dto.paymentIntentId,
        confirmOptions,
      );

      return plainToInstance(PaymentIntentRespDto, paymentIntent, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      this.logger.error('Error confirming payment:', error);
      throw new BadRequestException(
        `Failed to confirm payment: ${error.message}`,
      );
    }
  }

  /**
   * Retrieve a Payment Intent by ID
   */
  async getPaymentIntent(paymentIntentId: string): Promise<PaymentIntentRespDto> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(
        paymentIntentId,
      );

      return plainToInstance(PaymentIntentRespDto, paymentIntent, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      this.logger.error('Error retrieving payment intent:', error);
      throw new BadRequestException(
        `Failed to retrieve payment intent: ${error.message}`,
      );
    }
  }

  /**
   * Retrieve a Checkout Session by ID
   */
  async getCheckoutSession(sessionId: string): Promise<CheckoutSessionRespDto> {
    try {
      const session = await this.stripe.checkout.sessions.retrieve(sessionId);

      return plainToInstance(CheckoutSessionRespDto, session, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      this.logger.error('Error retrieving checkout session:', error);
      throw new BadRequestException(
        `Failed to retrieve checkout session: ${error.message}`,
      );
    }
  }

  /**
   * Cancel a Payment Intent
   */
  async cancelPaymentIntent(paymentIntentId: string): Promise<PaymentIntentRespDto> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.cancel(
        paymentIntentId,
      );

      return plainToInstance(PaymentIntentRespDto, paymentIntent, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      this.logger.error('Error canceling payment intent:', error);
      throw new BadRequestException(
        `Failed to cancel payment intent: ${error.message}`,
      );
    }
  }

  /**
   * Handle Stripe webhooks
   */
  async handleWebhook(
    payload: string | Buffer,
    signature: string,
  ): Promise<{ received: boolean; eventType: string }> {
    try {
      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        this.config.stripe.webhookSecret,
      );

      this.logger.log(`Received webhook event: ${event.type}`);

      // Handle the event
      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
          break;
        case 'payment_intent.payment_failed':
          await this.handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
          break;
        case 'checkout.session.completed':
          await this.handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
          break;
        case 'invoice.payment_succeeded':
          await this.handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
          break;
        case 'invoice.payment_failed':
          await this.handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
          break;
        default:
          this.logger.warn(`Unhandled event type: ${event.type}`);
      }

      return {
        received: true,
        eventType: event.type,
      };
    } catch (error) {
      this.logger.error('Error handling webhook:', error);
      throw new BadRequestException(
        `Webhook signature verification failed: ${error.message}`,
      );
    }
  }

  /**
   * Create or retrieve a customer by email
   */
  private async createOrRetrieveCustomer(
    email: string,
    name?: string,
  ): Promise<Stripe.Customer> {
    try {
      // First, search for existing customer
      const existingCustomers = await this.stripe.customers.list({
        email: email,
        limit: 1,
      });

      if (existingCustomers.data.length > 0) {
        return existingCustomers.data[0];
      }

      // Create new customer if not found
      const customer = await this.stripe.customers.create({
        email: email,
        name: name,
      });

      return customer;
    } catch (error) {
      this.logger.error('Error creating/retrieving customer:', error);
      throw new BadRequestException(
        `Failed to create/retrieve customer: ${error.message}`,
      );
    }
  }

  /**
   * Handle successful payment intent
   */
  private async handlePaymentIntentSucceeded(
    paymentIntent: Stripe.PaymentIntent,
  ): Promise<void> {
    this.logger.log(`Payment succeeded: ${paymentIntent.id}`);
    // Add your business logic here (e.g., update order status, send confirmation email)
  }

  /**
   * Handle failed payment intent
   */
  private async handlePaymentIntentFailed(
    paymentIntent: Stripe.PaymentIntent,
  ): Promise<void> {
    this.logger.log(`Payment failed: ${paymentIntent.id}`);
    // Add your business logic here (e.g., notify customer, retry payment)
  }

  /**
   * Handle completed checkout session
   */
  private async handleCheckoutSessionCompleted(
    session: Stripe.Checkout.Session,
  ): Promise<void> {
    this.logger.log(`Checkout session completed: ${session.id}`);
    // Add your business logic here (e.g., fulfill order, send confirmation)
  }

  /**
   * Handle successful invoice payment
   */
  private async handleInvoicePaymentSucceeded(
    invoice: Stripe.Invoice,
  ): Promise<void> {
    this.logger.log(`Invoice payment succeeded: ${invoice.id}`);
    // Add your business logic here
  }

  /**
   * Handle failed invoice payment
   */
  private async handleInvoicePaymentFailed(
    invoice: Stripe.Invoice,
  ): Promise<void> {
    this.logger.log(`Invoice payment failed: ${invoice.id}`);
    // Add your business logic here
  }

  /**
   * Create a Payment Method
   */
  async createPaymentMethod(
    dto: CreatePaymentMethodReqDto,
  ): Promise<PaymentMethodRespDto> {
    try {
      // Create or retrieve customer
      const customer = await this.createOrRetrieveCustomer(dto.customerEmail);

      const paymentMethodParams: Stripe.PaymentMethodCreateParams = {
        type: dto.type as Stripe.PaymentMethodCreateParams.Type,
        billing_details: dto.billing_details,
        metadata: dto.metadata || {},
      };

      // Add card details if provided and type is card
      if (dto.type === 'card' && dto.card) {
        paymentMethodParams.card = dto.card;
      }

      const paymentMethod = await this.stripe.paymentMethods.create(paymentMethodParams);

      // Attach to customer
      await this.stripe.paymentMethods.attach(paymentMethod.id, {
        customer: customer.id,
      });

      return plainToInstance(PaymentMethodRespDto, paymentMethod, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      this.logger.error('Error creating payment method:', error);
      throw new BadRequestException(
        `Failed to create payment method: ${error.message}`,
      );
    }
  }

  /**
   * Get a Payment Method by ID
   */
  async getPaymentMethod(paymentMethodId: string): Promise<PaymentMethodRespDto> {
    try {
      const paymentMethod = await this.stripe.paymentMethods.retrieve(paymentMethodId);

      return plainToInstance(PaymentMethodRespDto, paymentMethod, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      this.logger.error('Error retrieving payment method:', error);
      throw new BadRequestException(
        `Failed to retrieve payment method: ${error.message}`,
      );
    }
  }

  /**
   * List Payment Methods for a customer
   */
  async listPaymentMethods(
    dto: ListPaymentMethodsReqDto,
  ): Promise<PaymentMethodsListRespDto> {
    try {
      // Get customer by email
      const customer = await this.createOrRetrieveCustomer(dto.customerEmail);

      const params: Stripe.PaymentMethodListParams = {
        customer: customer.id,
        type: dto.type as Stripe.PaymentMethodListParams.Type,
        limit: dto.limit || 10,
      };

      const paymentMethods = await this.stripe.paymentMethods.list(params);

      return plainToInstance(PaymentMethodsListRespDto, paymentMethods, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      this.logger.error('Error listing payment methods:', error);
      throw new BadRequestException(
        `Failed to list payment methods: ${error.message}`,
      );
    }
  }

  /**
   * Attach a Payment Method to a customer
   */
  async attachPaymentMethod(
    dto: AttachPaymentMethodReqDto,
  ): Promise<PaymentMethodRespDto> {
    try {
      // Get customer by email
      const customer = await this.createOrRetrieveCustomer(dto.customerEmail);

      const paymentMethod = await this.stripe.paymentMethods.attach(
        dto.paymentMethodId,
        {
          customer: customer.id,
        },
      );

      return plainToInstance(PaymentMethodRespDto, paymentMethod, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      this.logger.error('Error attaching payment method:', error);
      throw new BadRequestException(
        `Failed to attach payment method: ${error.message}`,
      );
    }
  }

  /**
   * Detach a Payment Method from a customer
   */
  async detachPaymentMethod(paymentMethodId: string): Promise<PaymentMethodRespDto> {
    try {
      const paymentMethod = await this.stripe.paymentMethods.detach(paymentMethodId);

      return plainToInstance(PaymentMethodRespDto, paymentMethod, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      this.logger.error('Error detaching payment method:', error);
      throw new BadRequestException(
        `Failed to detach payment method: ${error.message}`,
      );
    }
  }

  /**
   * Update a Payment Method
   */
  async updatePaymentMethod(
    paymentMethodId: string,
    updateData: UpdatePaymentMethodReqDto,
  ): Promise<PaymentMethodRespDto> {
    try {
      const paymentMethod = await this.stripe.paymentMethods.update(
        paymentMethodId,
        updateData,
      );

      return plainToInstance(PaymentMethodRespDto, paymentMethod, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      this.logger.error('Error updating payment method:', error);
      throw new BadRequestException(
        `Failed to update payment method: ${error.message}`,
      );
    }
  }
} 