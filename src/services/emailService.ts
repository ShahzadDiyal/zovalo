// src/services/emailService.ts
import nodemailer from "nodemailer";

interface OrderEmailData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  customerCity: string;
  customerPostalCode: string;
  customerCountry: string;
  products: Array<{
    title: string;
    price: number;
    quantity: number;
    image?: string;
    color?: string;
    seater?: string;
  }>;
  totalPrice: number;
  orderDate: string;
  deliveryNotes?: string;
}

class EmailService {
  private transporter!: nodemailer.Transporter;
  private isConfigured: boolean;

  constructor() {
    this.isConfigured = false;

    // Check if SMTP credentials are configured
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
      this.isConfigured = true;
      console.log("Email service configured with shahzaddiyal786@gmail.com");
    } else {
      console.warn(
        "⚠️ Email service not configured. SMTP credentials missing.",
      );
    }
  }

  async sendOrderEmails(
    orderData: OrderEmailData,
  ): Promise<{ adminSent: boolean; customerSent: boolean }> {
    if (!this.isConfigured) {
      console.error("❌ Email service not configured. Cannot send emails.");
      return { adminSent: false, customerSent: false };
    }

    const adminSent = await this.sendOrderNotification(orderData);
    const customerSent = await this.sendCustomerConfirmation(orderData);
    return { adminSent, customerSent };
  }

  private async sendOrderNotification(
    orderData: OrderEmailData,
  ): Promise<boolean> {
    try {
      console.log(
        `📧 Sending order notification for order #${orderData.orderId.slice(-8).toUpperCase()}...`,
      );
      console.log(
        `📧 Sending to: ${process.env.ADMIN_EMAIL || "shahzaddiyal786@gmail.com"}`,
      );

      const htmlContent = this.generateOrderEmailHTML(orderData);
      const textContent = this.generateOrderEmailText(orderData);

      const mailOptions = {
        from: process.env.SMTP_FROM || "shahzaddiyal786@gmail.com",
        to: process.env.ADMIN_EMAIL || "shahzaddiyal786@gmail.com",
        subject: `🛍️ NEW ORDER #${orderData.orderId.slice(-8).toUpperCase()} - Royal Furniture`,
        text: textContent,
        html: htmlContent,
        // Also send a copy to yourself
        bcc: process.env.BCC_EMAIL || "shahzaddiyal786@gmail.com",
        // Add reply-to so you can reply directly
        replyTo: orderData.customerEmail,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log(
        `Order email sent successfully! Message ID: ${info.messageId}`,
      );
      console.log(
        `Admin notified at: ${process.env.ADMIN_EMAIL || "shahzaddiyal786@gmail.com"}`,
      );
      return true;
    } catch (error) {
      console.error("❌ Error sending order email:", error);
      if (error instanceof Error) {
        console.error("Error details:", error.message);
      }
      return false;
    }
  }

  private async sendCustomerConfirmation(
    orderData: OrderEmailData,
  ): Promise<boolean> {
    try {
      console.log(
        `📧 Sending customer confirmation to ${orderData.customerEmail}...`,
      );

      const htmlContent = this.generateCustomerEmailHTML(orderData);
      const textContent = this.generateCustomerEmailText(orderData);

      const mailOptions = {
        from: process.env.SMTP_FROM || "shahzaddiyal786@gmail.com",
        to: orderData.customerEmail,
        subject: `Order Confirmation #${orderData.orderId.slice(-8).toUpperCase()} - Royal Furniture`,
        text: textContent,
        html: htmlContent,
        replyTo: process.env.ADMIN_EMAIL || "shahzaddiyal786@gmail.com",
        // Send a copy to admin as well
        bcc: process.env.ADMIN_EMAIL || "shahzaddiyal786@gmail.com",
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log(
        `Customer confirmation sent successfully! Message ID: ${info.messageId}`,
      );
      return true;
    } catch (error) {
      console.error("❌ Error sending customer confirmation:", error);
      if (error instanceof Error) {
        console.error("Error details:", error.message);
      }
      return false;
    }
  }

  private generateOrderEmailHTML(data: OrderEmailData): string {
    const productRows = data.products
      .map(
        (p) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #e5e5e5;">
          <strong>${p.title}</strong>
          ${p.color ? `<br><small style="color: #666;">Color: ${p.color}</small>` : ""}
          ${p.seater ? `<br><small style="color: #666;">Seater: ${p.seater}</small>` : ""}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #e5e5e5; text-align: center;">${p.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e5e5e5; text-align: right;">£${p.price.toFixed(2)}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e5e5e5; text-align: right;">£${(p.price * p.quantity).toFixed(2)}</td>
      </tr>
    `,
      )
      .join("");

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Order - Royal Furniture</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 0; background: #f5f5f2; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #ffffff; }
          .header { background: #1a1a1a; color: #d4af37; padding: 20px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; font-weight: 300; letter-spacing: 2px; }
          .content { padding: 20px; }
          .section { margin-bottom: 25px; }
          .section-title { font-size: 14px; font-weight: bold; color: #8b6d3d; border-bottom: 2px solid #d4af37; padding-bottom: 5px; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 1px; }
          .info-row { display: flex; padding: 5px 0; }
          .info-label { font-weight: bold; width: 120px; color: #666; }
          .info-value { color: #1a1a1a; }
          table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          th { background: #f5f5f2; padding: 10px; text-align: left; font-size: 12px; text-transform: uppercase; color: #666; }
          .total-row { font-size: 18px; font-weight: bold; color: #d4af37; border-top: 2px solid #d4af37; padding-top: 10px; }
          .footer { text-align: center; padding: 20px; color: #999; font-size: 12px; border-top: 1px solid #e5e5e5; }
          .status-badge { display: inline-block; background: #d4af37; color: #1a1a1a; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: bold; }
          .admin-note { background: #fff3cd; border-left: 4px solid #ffc107; padding: 12px; margin: 15px 0; border-radius: 4px; }
          .admin-note strong { color: #856404; }
          .contact-box { background: #d4edda; padding: 15px; border-radius: 8px; text-align: center; border: 2px solid #28a745; margin: 15px 0; }
          .contact-box p { margin: 5px 0; color: #155724; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Royal Furniture</h1>
            <p style="color: #fff; margin: 5px 0 0;">New Order Notification</p>
          </div>
          
          <div class="content">
            <div style="text-align: center; margin-bottom: 20px;">
              <span class="status-badge">🆕 NEW ORDER</span>
              <h2 style="margin: 10px 0 0; color: #1a1a1a;">Order #${data.orderId.slice(-8).toUpperCase()}</h2>
              <p style="color: #666; margin: 5px 0;">${data.orderDate}</p>
            </div>

            <div class="admin-note">
              <strong>📋 ACTION REQUIRED:</strong> This order needs to be processed. Please contact the customer to confirm delivery.
            </div>

            <div class="section">
              <div class="section-title">👤 Customer Information</div>
              <div class="info-row"><span class="info-label">Name:</span><span class="info-value">${data.customerName}</span></div>
              <div class="info-row"><span class="info-label">Email:</span><span class="info-value">${data.customerEmail}</span></div>
              <div class="info-row"><span class="info-label">Phone:</span><span class="info-value">${data.customerPhone}</span></div>
              <div class="info-row"><span class="info-label">Address:</span><span class="info-value">${data.customerAddress}, ${data.customerCity}, ${data.customerPostalCode}</span></div>
              <div class="info-row"><span class="info-label">Country:</span><span class="info-value">${data.customerCountry}</span></div>
              ${data.deliveryNotes ? `<div class="info-row"><span class="info-label">Notes:</span><span class="info-value">${data.deliveryNotes}</span></div>` : ""}
            </div>

            <div class="section">
              <div class="section-title">📦 Order Items</div>
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th style="text-align: center;">Qty</th>
                    <th style="text-align: right;">Price</th>
                    <th style="text-align: right;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${productRows}
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="3" style="padding: 10px; text-align: right; font-weight: bold;">Subtotal:</td>
                    <td style="padding: 10px; text-align: right;">£${data.totalPrice.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colspan="3" style="padding: 10px; text-align: right; font-weight: bold;">Delivery:</td>
                    <td style="padding: 10px; text-align: right; color: #27ae60;">FREE</td>
                  </tr>
                  <tr class="total-row">
                    <td colspan="3" style="padding: 10px; text-align: right; font-size: 18px;">TOTAL:</td>
                    <td style="padding: 10px; text-align: right; font-size: 18px;">£${data.totalPrice.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div style="background: #f0f7f0; padding: 15px; border-radius: 8px; text-align: center; margin: 15px 0;">
              <p style="margin: 0; color: #27ae60; font-weight: bold;">💳 Payment Method: Cash on Delivery (COD)</p>
              <p style="margin: 5px 0 0; color: #666; font-size: 13px;">Customer will pay upon delivery inspection</p>
            </div>

            <div class="contact-box">
              <p style="font-weight: bold; font-size: 14px;">📞 CONTACT CUSTOMER</p>
              <p>Call: <strong>${data.customerPhone}</strong></p>
              <p>Email: <strong>${data.customerEmail}</strong></p>
            </div>
          </div>

          <div class="footer">
            <p>© ${new Date().getFullYear()} Royal Furniture. All rights reserved.</p>
            <p style="color: #ccc; font-size: 11px;">This order notification was sent to shahzaddiyal786@gmail.com</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generateOrderEmailText(data: OrderEmailData): string {
    const productList = data.products
      .map(
        (p) =>
          `  - ${p.title} x${p.quantity} = £${(p.price * p.quantity).toFixed(2)}`,
      )
      .join("\n");

    return `
🚨 NEW ORDER - Royal Furniture
============================
Order #${data.orderId.slice(-8).toUpperCase()}
Date: ${data.orderDate}

⚠️ ACTION REQUIRED: Please process this order and contact the customer.

CUSTOMER INFORMATION
-------------------
Name: ${data.customerName}
Email: ${data.customerEmail}
Phone: ${data.customerPhone}
Address: ${data.customerAddress}, ${data.customerCity}, ${data.customerPostalCode}
Country: ${data.customerCountry}
${data.deliveryNotes ? `Notes: ${data.deliveryNotes}` : ""}

ORDER ITEMS
-----------
${productList}

Total: £${data.totalPrice.toFixed(2)}
Payment: Cash on Delivery

📞 CONTACT CUSTOMER: ${data.customerPhone}

---
Royal Furniture
https://royalfurnitures.store
This notification sent to shahzaddiyal786@gmail.com
    `;
  }

  private generateCustomerEmailHTML(data: OrderEmailData): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation - Royal Furniture</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 0; background: #f5f5f2; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #ffffff; }
          .header { background: #1a1a1a; color: #d4af37; padding: 20px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; font-weight: 300; letter-spacing: 2px; }
          .content { padding: 20px; }
          .confirmation-box { background: #f0f7f0; border: 2px solid #27ae60; padding: 15px; text-align: center; border-radius: 8px; margin-bottom: 20px; }
          .footer { text-align: center; padding: 20px; color: #999; font-size: 12px; border-top: 1px solid #e5e5e5; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Royal Furniture</h1>
            <p style="color: #fff; margin: 5px 0 0;">Order Confirmation</p>
          </div>
          
          <div class="content">
            <div class="confirmation-box">
              <h2 style="margin: 0; color: #27ae60;">Thank You for Your Order!</h2>
              <p style="margin: 5px 0 0; color: #555;">Order #${data.orderId.slice(-8).toUpperCase()}</p>
            </div>

            <p style="color: #555; line-height: 1.6;">Dear ${data.customerName},</p>
            <p style="color: #555; line-height: 1.6;">Thank you for shopping with Royal Furniture. We have received your order and will process it shortly.</p>

            <h3 style="color: #1a1a1a; border-bottom: 1px solid #e5e5e5; padding-bottom: 5px;">Order Summary</h3>
            <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
              <thead>
                <tr style="background: #f5f5f2;">
                  <th style="padding: 8px; text-align: left;">Product</th>
                  <th style="padding: 8px; text-align: center;">Qty</th>
                  <th style="padding: 8px; text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${data.products
                  .map(
                    (p) => `
                  <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #e5e5e5;">${p.title}</td>
                    <td style="padding: 8px; border-bottom: 1px solid #e5e5e5; text-align: center;">${p.quantity}</td>
                    <td style="padding: 8px; border-bottom: 1px solid #e5e5e5; text-align: right;">£${(p.price * p.quantity).toFixed(2)}</td>
                  </tr>
                `,
                  )
                  .join("")}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Total:</td>
                  <td style="padding: 10px; text-align: right; font-size: 18px; color: #d4af37; font-weight: bold;">£${data.totalPrice.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>

            <div style="background: #f5f5f2; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <p style="margin: 0; font-weight: bold;">🚚 Delivery Information</p>
              <p style="margin: 5px 0; color: #555;">Free UK Delivery • 1-3 Business Days</p>
              <p style="margin: 5px 0; color: #555;">Cash on Delivery • Pay upon arrival</p>
            </div>

            <p style="color: #555; line-height: 1.6; margin-top: 20px;">
              If you have any questions about your order, please contact us at:
              <br>
              📞 +44 7529 661726
              <br>
              📧 sales@royalfurnitures.store
            </p>
          </div>

          <div class="footer">
            <p>© ${new Date().getFullYear()} Royal Furniture. All rights reserved.</p>
            <p style="color: #ccc; font-size: 11px;">Barton Aerodrome, Liverpool Rd, Eccles, Manchester, M30 7SA</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generateCustomerEmailText(data: OrderEmailData): string {
    return `
ORDER CONFIRMATION
==================
Thank you for your order, ${data.customerName}!

Order #${data.orderId.slice(-8).toUpperCase()}

Order Items:
${data.products.map((p) => `  - ${p.title} x${p.quantity}`).join("\n")}

Total: £${data.totalPrice.toFixed(2)}
Delivery: Free UK Delivery • 1-3 Business Days
Payment: Cash on Delivery

If you have any questions, please contact us:
📞 +44 7529 661726
📧 sales@royalfurnitures.store

---
Royal Furniture
https://royalfurnitures.store
    `;
  }
}

export const emailService = new EmailService();
