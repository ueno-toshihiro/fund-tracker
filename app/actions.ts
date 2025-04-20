"use server";

import { cookies } from "next/headers";

// KVが利用可能かどうかを確認する関数
let kvInstance: any = null;
export async function getKV() {
  if (kvInstance) return kvInstance;

  try {
    // 動的インポートを使用してKVをロードしようとする
    const { kv } = await import("@vercel/kv");
    kvInstance = kv;
    return kv;
  } catch (error) {
    console.warn("Vercel KV is not available:", error);
    return null;
  }
}

// お気に入りの追加/削除
export async function toggleFavorite(fundCode: string) {
  try {
    const userId = await getUserId();
    const kv = await getKV();

    if (!kv) {
      // KVが利用できない場合はクライアント側で処理するためにnullを返す
      return { success: true, isFavorite: null, useLocalStorage: true };
    }

    const key = `user:${userId}:favorites`;
    const favorites = await getFavorites();

    if (favorites.includes(fundCode)) {
      // お気に入りから削除
      await kv.srem(key, fundCode);
      return { success: true, isFavorite: false };
    } else {
      // お気に入りに追加
      await kv.sadd(key, fundCode);
      return { success: true, isFavorite: true };
    }
  } catch (error) {
    console.error("Error toggling favorite:", error);
    // エラーが発生した場合もクライアント側で処理
    return {
      success: false,
      isFavorite: null,
      useLocalStorage: true,
      error: String(error),
    };
  }
}

// お気に入り一覧の取得
export async function getFavorites(): Promise<string[]> {
  try {
    const userId = await getUserId();
    const kv = await getKV();

    if (!kv) {
      // KVが利用できない場合は空の配列を返す
      return [];
    }

    const key = `user:${userId}:favorites`;
    const favorites = await kv.smembers(key);
    return favorites || [];
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return [];
  }
}

// 簡易的なユーザーID取得（実際の認証システムに置き換えてください）
async function getUserId(): Promise<string> {
  const cookieStore = await cookies();

  return new Promise((resolve) => {
    const userId = cookieStore.get("userId")?.value;

    // userIdが存在しない場合は新規発行して保存
    if (!userId) {
      const newUserId = Math.random().toString(36).substring(2, 15);
      cookieStore.set("userId", newUserId, { maxAge: 60 * 60 * 24 * 30 }); // 30日間有効
      resolve(newUserId);
    } else {
      resolve(userId);
    }
  });
}
