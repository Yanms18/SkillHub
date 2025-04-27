import axios from 'axios';

class PaymentService {
  constructor() {
    this.paystackUrl = 'https://api.paystack.co';
    this.secretKey = process.env.REACT_APP_PAYSTACK_PUBLIC_KEY || '';
  }

  /**
   * Initiates a payment with Paystack.
   * @param {number} amount Amount to be paid (in kobo, so multiply by 100 for NGN).
   * @param {string} email Customer's email address.
   * @param {string} reference Payment reference.
   * @returns {Promise<string>} Payment initialization response, including the authorization URL.
   */
  async initiatePayment(amount, email, reference) {
    try {
      const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
      const response = await axios.post(
        `${this.paystackUrl}/transaction/initialize`,
        {
          email,
          amount: amount * 100,
          reference,
          callback_url: `${baseUrl}/PaymentCallback`
        },
        {
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data.data.authorization_url;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error initiating payment:', error.message);
        throw new Error('Failed to initiate payment. Please try again.');
      } else {
        console.error('Unknown error initiating payment:', error);
        throw new Error('An unknown error occurred while initiating payment.');
      }
    }
  }

  /**
   * Verifies a payment with Paystack.
   * @param {string} reference Payment reference returned by Paystack.
   * @returns {Promise<boolean>} Payment verification response.
   */
  async confirmPayment(reference) {
    try {
      const response = await axios.get(
        `${this.paystackUrl}/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
          },
        }
      );
      return response.data.data.status === 'success';
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error verifying payment:', error.message);
        throw new Error('Failed to verify payment. Please try again.');
      } else {
        console.error('Unknown error verifying payment:', error);
        throw new Error('An unknown error occurred while verifying payment.');
      }
    }
  }
}

export default PaymentService;