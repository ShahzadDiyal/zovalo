// src/app/api/blog-categories/route.ts
import { NextRequest, NextResponse } from "next/server";
import { blogCategoryApi } from "../../../services/blogCategoryApi";

export async function GET() {
  try {
    const categories = await blogCategoryApi.getAll();
    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch categories" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, description, image } = body;

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json(
        { success: false, error: "Name and slug are required" },
        { status: 400 },
      );
    }

    // Check if slug already exists
    const existing = await blogCategoryApi.getBySlug(slug);
    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error: "Slug already exists. Please use a different slug.",
        },
        { status: 400 },
      );
    }

    const id = await blogCategoryApi.create({
      name,
      slug: slug.toLowerCase().replace(/\s+/g, "-"),
      description: description || "",
      image: image || "",
    });

    return NextResponse.json({
      success: true,
      data: { id },
      message: "Category created successfully",
    });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create category. Please try again." },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, slug, description, image } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Category ID is required" },
        { status: 400 },
      );
    }

    await blogCategoryApi.update(id, {
      name,
      slug: slug.toLowerCase().replace(/\s+/g, "-"),
      description,
      image,
    });

    return NextResponse.json({
      success: true,
      message: "Category updated successfully",
    });
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update category" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Category ID is required" },
        { status: 400 },
      );
    }

    await blogCategoryApi.delete(id);

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete category" },
      { status: 500 },
    );
  }
}
