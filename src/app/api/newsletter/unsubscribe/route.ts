import { db } from "@/lib/db";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface JwtPayload {
  email: string;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const token = req.nextUrl.searchParams.get("token");

    if (!token) {
      return new NextResponse("Token manquant", { status: 400 });
    }

    const { email } = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    await db.newsletter.delete({
      where: { email },
    });

    return new NextResponse(null, {
      status: 302,
      headers: { Location: "/" },
    });
  } catch (error) {
    console.error("Erreur de désabonnement :", error);

    return new NextResponse(null, {
      status: 302,
      headers: { Location: "/" },
    });
  }
}
