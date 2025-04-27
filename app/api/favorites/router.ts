// サーバー側でお気に入り一覧を返すAPI
import { NextResponse } from "next/server";
import { getRedis } from "@/app/actions";
import { getUserId } from "@/app/actions";

export async function GET() {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ favorites: [] });
    }
    const redis = await getRedis();
    if (!redis) {
      return NextResponse.json({ favorites: [] });
    }
    const key = `user:${userId}:favorites`;
    const favorites = await redis.get(key);
    return NextResponse.json({ favorites: favorites || [] });
  } catch (error) {
    return NextResponse.json(
      { favorites: [], error: String(error) },
      { status: 500 }
    );
  }
}
