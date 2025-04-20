// サーバー側でお気に入り一覧を返すAPI
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getKV } from "@/app/actions";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;
    if (!userId) {
      return NextResponse.json({ favorites: [] });
    }
    const kv = await getKV();
    if (!kv) {
      return NextResponse.json({ favorites: [] });
    }
    const key = `user:${userId}:favorites`;
    const favorites = await kv.smembers(key);
    return NextResponse.json({ favorites: favorites || [] });
  } catch (error) {
    return NextResponse.json(
      { favorites: [], error: String(error) },
      { status: 500 }
    );
  }
}
