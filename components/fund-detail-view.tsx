"use client"

import { useState } from "react"
import type { FundDetail } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Star, Share2 } from "lucide-react"
import Link from "next/link"
import { toggleFavorite } from "@/app/actions"
import PerformanceChart from "@/components/performance-chart"

interface FundDetailViewProps {
  fund: FundDetail
}

export default function FundDetailView({ fund }: FundDetailViewProps) {
  const [isFavorite, setIsFavorite] = useState(false)

  const handleToggleFavorite = async () => {
    const result = await toggleFavorite(fund.fundCode)
    if (result.success && result.isFavorite !== null) {
      setIsFavorite(result.isFavorite)
    }
  }

  // 価格変動の表示用関数
  const renderPriceChange = (change: number) => {
    const color = change > 0 ? "text-green-600" : change < 0 ? "text-red-600" : "text-gray-600"
    const prefix = change > 0 ? "+" : ""
    return (
      <span className={color}>
        {prefix}
        {change.toFixed(2)}%
      </span>
    )
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー部分 */}
      <div className="flex flex-col gap-4">
        <Link href="/" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-1 h-4 w-4" />
          ファンド一覧に戻る
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{fund.fundName}</h1>
            <p className="text-muted-foreground">{fund.fundCode}</p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleToggleFavorite}>
              <Star className={`mr-1 h-4 w-4 ${isFavorite ? "fill-yellow-400" : ""}`} />
              お気に入り
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="mr-1 h-4 w-4" />
              共有
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-1 h-4 w-4" />
              目論見書
            </Button>
          </div>
        </div>
      </div>

      {/* 基本情報カード */}
      <Card>
        <CardHeader>
          <CardTitle>基本情報</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">基準価額</h3>
              <p className="text-2xl font-bold">{fund.basePrice.toLocaleString()} 円</p>
              <p className="text-sm">{fund.basePriceDate} 現在</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">前日比</h3>
              <p className="text-2xl font-bold flex items-center">
                {renderPriceChange(fund.priceChanges.day1)}
                <span className="text-base ml-2">({fund.priceChanges.day1Amount.toLocaleString()} 円)</span>
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">純資産総額</h3>
              <p className="text-2xl font-bold">{fund.netAssets.toLocaleString()} 億円</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* タブコンテンツ */}
      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="performance">パフォーマンス</TabsTrigger>
          <TabsTrigger value="risk">リスク指標</TabsTrigger>
          <TabsTrigger value="fee">手数料・コスト</TabsTrigger>
          <TabsTrigger value="info">ファンド情報</TabsTrigger>
        </TabsList>

        {/* パフォーマンスタブ */}
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>基準価額の推移</CardTitle>
              <CardDescription>直近1年間の基準価額の推移</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <PerformanceChart data={fund.performanceData} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>期間別リターン</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">1ヶ月</h3>
                  <p className="text-xl font-bold">{renderPriceChange(fund.returns.oneMonth)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">3ヶ月</h3>
                  <p className="text-xl font-bold">{renderPriceChange(fund.returns.threeMonths)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">6ヶ月</h3>
                  <p className="text-xl font-bold">{renderPriceChange(fund.returns.sixMonths)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">1年</h3>
                  <p className="text-xl font-bold">{renderPriceChange(fund.returns.oneYear)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">3年</h3>
                  <p className="text-xl font-bold">{renderPriceChange(fund.returns.threeYears)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* リスク指標タブ */}
        <TabsContent value="risk" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>リスク指標</CardTitle>
              <CardDescription>過去3年間のデータに基づく指標</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">標準偏差</h3>
                  <p className="text-xl font-bold">{fund.risk.standardDeviation.toFixed(2)}%</p>
                  <p className="text-xs text-muted-foreground">値動きの大きさを示す指標</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">シャープレシオ</h3>
                  <p className="text-xl font-bold">{fund.risk.sharpeRatio.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">リスクあたりのリターンを示す指標</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">最大ドローダウン</h3>
                  <p className="text-xl font-bold">{fund.risk.maxDrawdown.toFixed(2)}%</p>
                  <p className="text-xs text-muted-foreground">過去の最大下落率</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 手数料・コストタブ */}
        <TabsContent value="fee" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>手数料・コスト</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">購入時手数料</h3>
                    <p className="text-lg font-bold">{fund.fees.purchaseFee}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">信託財産留保額</h3>
                    <p className="text-lg font-bold">{fund.fees.redemptionFee}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">運用管理費用（信託報酬）</h3>
                  <p className="text-lg font-bold">年率 {fund.fees.managementFee}%（税込）</p>
                  <p className="text-xs text-muted-foreground">
                    内訳: 委託会社 {fund.fees.managementFeeBreakdown.company}%、販売会社{" "}
                    {fund.fees.managementFeeBreakdown.distributor}%、受託会社 {fund.fees.managementFeeBreakdown.trustee}
                    %
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ファンド情報タブ */}
        <TabsContent value="info" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>ファンド概要</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">設定日</h3>
                    <p>{fund.info.inceptionDate}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">償還日</h3>
                    <p>{fund.info.maturityDate}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">決算日</h3>
                    <p>{fund.info.dividendFrequency}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">ベンチマーク</h3>
                    <p>{fund.info.benchmark}</p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">ファンドの特色</h3>
                  <p className="text-sm whitespace-pre-line">{fund.info.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
