import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Put,
  Query,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiHeader,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { StripeService } from '../services/stripe.service';
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

@ApiTags('Stripe Payments')
@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('payment-intent')
  @ApiOperation({
    summary: 'Create Payment Intent',
    description: 'Creates a new Stripe Payment Intent for processing payments on the client side',
  })
  @ApiResponse({
    status: 201,
    description: 'Payment Intent created successfully',
    type: PaymentIntentRespDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid request data or Stripe API error',
  })
  async createPaymentIntent(
    @Body() createPaymentIntentDto: CreatePaymentIntentReqDto,
  ): Promise<PaymentIntentRespDto> {
    return this.stripeService.createPaymentIntent(createPaymentIntentDto);
  }

  @Post('checkout-session')
  @ApiOperation({
    summary: 'Create Checkout Session',
    description: 'Creates a Stripe Checkout Session for hosted payment page',
  })
  @ApiResponse({
    status: 201,
    description: 'Checkout Session created successfully',
    type: CheckoutSessionRespDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid request data or Stripe API error',
  })
  async createCheckoutSession(
    @Body() createCheckoutSessionDto: CreateCheckoutSessionReqDto,
  ): Promise<CheckoutSessionRespDto> {
    return this.stripeService.createCheckoutSession(createCheckoutSessionDto);
  }

  @Post('payment-intent/:id/confirm')
  @ApiOperation({
    summary: 'Confirm Payment Intent',
    description: 'Confirms a Payment Intent to complete the payment process',
  })
  @ApiParam({
    name: 'id',
    description: 'Payment Intent ID',
    example: 'pi_1234567890abcdef',
  })
  @ApiResponse({
    status: 200,
    description: 'Payment Intent confirmed successfully',
    type: PaymentIntentRespDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid Payment Intent ID or confirmation failed',
  })
  @ApiNotFoundResponse({
    description: 'Payment Intent not found',
  })
  async confirmPayment(
    @Param('id') paymentIntentId: string,
    @Body() confirmPaymentDto: ConfirmPaymentReqDto,
  ): Promise<PaymentIntentRespDto> {
    // Override the ID from URL parameter
    confirmPaymentDto.paymentIntentId = paymentIntentId;
    return this.stripeService.confirmPayment(confirmPaymentDto);
  }

  @Get('payment-intent/:id')
  @ApiOperation({
    summary: 'Get Payment Intent',
    description: 'Retrieves a Payment Intent by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Payment Intent ID',
    example: 'pi_1234567890abcdef',
  })
  @ApiResponse({
    status: 200,
    description: 'Payment Intent retrieved successfully',
    type: PaymentIntentRespDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid Payment Intent ID',
  })
  @ApiNotFoundResponse({
    description: 'Payment Intent not found',
  })
  async getPaymentIntent(
    @Param('id') paymentIntentId: string,
  ): Promise<PaymentIntentRespDto> {
    return this.stripeService.getPaymentIntent(paymentIntentId);
  }

  @Get('checkout-session/:id')
  @ApiOperation({
    summary: 'Get Checkout Session',
    description: 'Retrieves a Checkout Session by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Checkout Session ID',
    example: 'cs_1234567890abcdef',
  })
  @ApiResponse({
    status: 200,
    description: 'Checkout Session retrieved successfully',
    type: CheckoutSessionRespDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid Checkout Session ID',
  })
  @ApiNotFoundResponse({
    description: 'Checkout Session not found',
  })
  async getCheckoutSession(
    @Param('id') sessionId: string,
  ): Promise<CheckoutSessionRespDto> {
    return this.stripeService.getCheckoutSession(sessionId);
  }

  @Delete('payment-intent/:id')
  @ApiOperation({
    summary: 'Cancel Payment Intent',
    description: 'Cancels a Payment Intent that has not been confirmed',
  })
  @ApiParam({
    name: 'id',
    description: 'Payment Intent ID',
    example: 'pi_1234567890abcdef',
  })
  @ApiResponse({
    status: 200,
    description: 'Payment Intent cancelled successfully',
    type: PaymentIntentRespDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid Payment Intent ID or cancellation failed',
  })
  @ApiNotFoundResponse({
    description: 'Payment Intent not found',
  })
  async cancelPaymentIntent(
    @Param('id') paymentIntentId: string,
  ): Promise<PaymentIntentRespDto> {
    return this.stripeService.cancelPaymentIntent(paymentIntentId);
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Stripe Webhook Handler',
    description: 'Handles incoming Stripe webhook events for payment processing',
  })
  @ApiHeader({
    name: 'stripe-signature',
    description: 'Stripe webhook signature for verification',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Webhook processed successfully',
    schema: {
      type: 'object',
      properties: {
        received: {
          type: 'boolean',
          example: true,
        },
        eventType: {
          type: 'string',
          example: 'payment_intent.succeeded',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid webhook signature or payload',
  })
  async handleWebhook(
    @Req() request: Request,
    @Headers('stripe-signature') signature: string,
  ): Promise<{ received: boolean; eventType: string }> {
    const payload = JSON.stringify(request.body);
    return this.stripeService.handleWebhook(payload, signature);
  }

  // Payment Methods endpoints

  @Post('payment-methods')
  @ApiOperation({
    summary: 'Create Payment Method',
    description: 'Creates a new payment method (card, bank account, etc.) and attaches it to a customer',
  })
  @ApiResponse({
    status: 201,
    description: 'Payment method created successfully',
    type: PaymentMethodRespDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid request data or Stripe API error',
  })
  async createPaymentMethod(
    @Body() createPaymentMethodDto: CreatePaymentMethodReqDto,
  ): Promise<PaymentMethodRespDto> {
    return this.stripeService.createPaymentMethod(createPaymentMethodDto);
  }

  @Get('payment-methods/:id')
  @ApiOperation({
    summary: 'Get Payment Method',
    description: 'Retrieves a payment method by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Payment Method ID',
    example: 'pm_1234567890abcdef',
  })
  @ApiResponse({
    status: 200,
    description: 'Payment method retrieved successfully',
    type: PaymentMethodRespDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid Payment Method ID',
  })
  @ApiNotFoundResponse({
    description: 'Payment method not found',
  })
  async getPaymentMethod(
    @Param('id') paymentMethodId: string,
  ): Promise<PaymentMethodRespDto> {
    return this.stripeService.getPaymentMethod(paymentMethodId);
  }

  @Get('payment-methods')
  @ApiOperation({
    summary: 'List Payment Methods',
    description: 'Lists all payment methods for a customer',
  })
  @ApiResponse({
    status: 200,
    description: 'Payment methods listed successfully',
    type: PaymentMethodsListRespDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid request parameters',
  })
  async listPaymentMethods(
    @Query() listPaymentMethodsDto: ListPaymentMethodsReqDto,
  ): Promise<PaymentMethodsListRespDto> {
    return this.stripeService.listPaymentMethods(listPaymentMethodsDto);
  }

  @Post('payment-methods/attach')
  @ApiOperation({
    summary: 'Attach Payment Method',
    description: 'Attaches an existing payment method to a customer',
  })
  @ApiResponse({
    status: 200,
    description: 'Payment method attached successfully',
    type: PaymentMethodRespDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid request data or payment method already attached',
  })
  async attachPaymentMethod(
    @Body() attachPaymentMethodDto: AttachPaymentMethodReqDto,
  ): Promise<PaymentMethodRespDto> {
    return this.stripeService.attachPaymentMethod(attachPaymentMethodDto);
  }

  @Delete('payment-methods/:id/detach')
  @ApiOperation({
    summary: 'Detach Payment Method',
    description: 'Detaches a payment method from its customer',
  })
  @ApiParam({
    name: 'id',
    description: 'Payment Method ID',
    example: 'pm_1234567890abcdef',
  })
  @ApiResponse({
    status: 200,
    description: 'Payment method detached successfully',
    type: PaymentMethodRespDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid Payment Method ID or detachment failed',
  })
  @ApiNotFoundResponse({
    description: 'Payment method not found',
  })
  async detachPaymentMethod(
    @Param('id') paymentMethodId: string,
  ): Promise<PaymentMethodRespDto> {
    return this.stripeService.detachPaymentMethod(paymentMethodId);
  }

  @Put('payment-methods/:id')
  @ApiOperation({
    summary: 'Update Payment Method',
    description: 'Updates a payment method\'s billing details or metadata',
  })
  @ApiParam({
    name: 'id',
    description: 'Payment Method ID',
    example: 'pm_1234567890abcdef',
  })
  @ApiResponse({
    status: 200,
    description: 'Payment method updated successfully',
    type: PaymentMethodRespDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid Payment Method ID or update data',
  })
  @ApiNotFoundResponse({
    description: 'Payment method not found',
  })
  async updatePaymentMethod(
    @Param('id') paymentMethodId: string,
    @Body() updateData: UpdatePaymentMethodReqDto,
  ): Promise<PaymentMethodRespDto> {
    return this.stripeService.updatePaymentMethod(paymentMethodId, updateData);
  }
} 