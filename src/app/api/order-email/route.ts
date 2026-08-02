// src/app/api/order-email/route.ts
import { NextRequest, NextResponse } from "next/server";
import { emailService } from "../../../services/emailService";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderData } = body;

    if (!orderData) {
      return NextResponse.json(
        { success: false, error: "Order data is required" },
        { status: 400 },
      );
    }

    // Validate required fields
    const requiredFields = [
      "orderId",
      "customerName",
      "customerEmail",
      "customerPhone",
      "customerAddress",
      "products",
      "totalPrice",
    ];
    for (const field of requiredFields) {
      if (!orderData[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 },
        );
      }
    }

    console.log(
      `📧 Sending emails for order #${orderData.orderId.slice(-8).toUpperCase()}...`,
    );
    console.log(
      `📧 Admin email: ${process.env.ADMIN_EMAIL || "shahzaddiyal786@gmail.com"}`,
    );

    // Send emails
    const result = await emailService.sendOrderEmails(orderData);

    if (result.adminSent && result.customerSent) {
      console.log(
        `All emails sent successfully for order #${orderData.orderId.slice(-8).toUpperCase()}`,
      );
      return NextResponse.json({
        success: true,
        message: "Order emails sent successfully",
        data: result,
      });
    } else {
      console.warn(
        `⚠️ Some emails failed for order #${orderData.orderId.slice(-8).toUpperCase()}`,
      );
      return NextResponse.json(
        {
          success: false,
          message: "Some emails failed to send",
          data: result,
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("❌ Error in order-email API:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
