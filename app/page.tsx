import { Suspense } from "react"
import FundList from "@/components/fund-list"
import { getFunds } from "@/lib/api"
import { getFavorites } from "./actions"

export default async function Home() {
  // サーバーサイドでデータを取得
  const fundsPromise = getFunds()
  const favoritesPromise = getFavorites()

  const [funds, favorites] = await Promise.all([fundsPromise, favoritesPromise])

  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">最新ファンド情報一覧</h1>
      <Suspense fallback={<div>ファンド情報を読み込み中...</div>}>
        <FundList initialFunds={funds} initialFavorites={favorites} />
      </Suspense>
    </main>
  )
}
