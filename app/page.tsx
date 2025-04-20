/*
 * dynamicをforce-dynamicに設定します
 * getFunds関数で「no-store」を使ったfetchがあるため「このページはリクエストごとにサーバーで生成しなければならない」と判断し静的生成を拒否するため
*/
export const dynamic = "force-dynamic";

import { Suspense } from "react"
import FundList from "@/components/fund-list"
import { getFunds } from "@/lib/api"

export default async function Home() {
  // サーバーサイドでデータを取得
  const fundsPromise = getFunds()

  const [funds] = await Promise.all([fundsPromise])

  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">最新ファンド情報一覧</h1>
      <Suspense fallback={<div>ファンド情報を読み込み中...</div>}>
        <FundList initialFunds={funds} />
      </Suspense>
    </main>
  )
}
