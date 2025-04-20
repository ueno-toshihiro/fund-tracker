import { getFundDetail } from "@/lib/api"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import FundDetailView from "@/components/fund-detail-view"

interface FundDetailPageProps {
  params: {
    fundCode: string
  }
}

// 動的メタデータの生成
export async function generateMetadata({ params }: FundDetailPageProps): Promise<Metadata> {
  const fundCode = params.fundCode
  const fund = await getFundDetail(fundCode)

  if (!fund) {
    return {
      title: "ファンドが見つかりません",
    }
  }

  return {
    title: `${fund.fundName} | ファンド詳細`,
    description: `${fund.fundName}（${fund.fundCd}）の詳細情報、パフォーマンス、リスク指標などをご確認いただけます。`,
  }
}

export default async function FundDetailPage({ params }: FundDetailPageProps) {
  const fundCode = params.fundCode
  const fund = await getFundDetail(fundCode)

  if (!fund) {
    notFound()
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <FundDetailView fund={fund} />
    </main>
  )
}
