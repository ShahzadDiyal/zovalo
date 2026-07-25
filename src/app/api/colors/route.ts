// src/app/api/colors/route.ts
import { NextRequest, NextResponse } from "next/server";
import { colorApi } from "../../../services/colorApi";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const active = searchParams.get("active");

    let colors;
    if (active === "true") {
      colors = await colorApi.getActiveColors();
    } else {
      colors = await colorApi.getAll();
    }

    return NextResponse.json({
      success: true,
      data: colors,
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, hex, fabric, image, isActive, sortOrder } = body;

    if (!name || !hex || !fabric) {
      return NextResponse.json(
        { success: false, error: "Name, Hex, and Fabric are required" },
        { status: 400 },
      );
    }

    const id = await colorApi.create({
      name,
      hex,
      fabric,
      image: image || "",
      isActive: isActive !== undefined ? isActive : true,
      sortOrder: sortOrder || 0,
    });

    return NextResponse.json({
      success: true,
      data: { id },
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
