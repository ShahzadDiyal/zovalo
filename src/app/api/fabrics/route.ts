// src/app/api/fabrics/route.ts
import { NextRequest, NextResponse } from "next/server";
import { colorApi } from "../../../services/colorApi";

export async function GET() {
  try {
    const fabrics = await colorApi.getFabrics();
    return NextResponse.json({
      success: true,
      data: fabrics,
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: String(error),
      },
      { status: 500 },
    );
  }
}
