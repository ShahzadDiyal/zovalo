// src/app/api/test-order-email/route.ts
import { NextRequest, NextResponse } from "next/server";
import { emailService } from "../../../services/emailService";

export async function GET(request: NextRequest) {
  // Only allow if the secret token matches
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");
  if (token !== process.env.TEST_API_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    return NextResponse.json(
      { error: "ADMIN_EMAIL not configured" },
      { status: 500 }
    );
  }

  try {
    const testOrderData = {
      orderId: "test-" + Date.now(),
      customerName: "Test Customer",
      customerEmail: adminEmail,
      customerPhone: "+44 7123 456789",
      customerAddress: "123 Test Street",
      customerCity: "Manchester",
      customerPostalCode: "M1 1AA",
      customerCountry: "United Kingdom",
      products: [
        {
          title: "Test Sofa - Luxury Chesterfield",
          price: 899.99,
          quantity: 1,
          image: "https://via.placeholder.com/100",
          color: "Brown",
          seater: "3 Seater",
        },
        {
          title: "Test Dining Table - Oak Finish",
          price: 499.99,
          quantity: 2,
          image: "https://via.placeholder.com/100",
          color: "Oak",
          seater: "6 Seater",
        },
      ],
      totalPrice: 1899.97,
      orderDate: new Date().toLocaleString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      deliveryNotes: "Please call before delivery. Gate code: 1234",
    };

    const result = await emailService.sendOrderEmails(testOrderData);

    if (result.adminSent && result.customerSent) {
      return NextResponse.json({
        success: true,
        message: "Test order emails sent successfully",
        data: {
          adminSent: result.adminSent,
          customerSent: result.customerSent,
          adminEmail,
          customerEmail: adminEmail,
        },
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Some test emails failed",
          data: result,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("❌ Error sending test order email:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}