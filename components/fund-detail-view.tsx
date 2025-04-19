"use client";

import { useState } from "react";
import type { FundDetail } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Star, Share2 } from "lucide-react";
import Link from "next/link";
import { toggleFavorite } from "@/app/actions";
import PerformanceChart from "@/components/performance-chart";

interface FundDetailViewProps {
  fund: FundDetail;
}

export default function FundDetailView({ fund }: FundDetailViewProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleToggleFavorite = async () => {
    const result = await toggleFavorite(fund.fundCd);
    if (result.success && result.isFavorite !== null) {
      setIsFavorite(result.isFavorite);
    }
  };

  // 価格変動の表示用関数
  const renderPriceChange = (change: string | number) => {
    const value = typeof change === "string" ? parseFloat(change) : change;
    const color =
      value > 0
        ? "text-green-600"
        : value < 0
        ? "text-red-600"
        : "text-gray-600";
    const prefix = value > 0 ? "+" : "";
    return (
      <span className={color}>
        {prefix}
        {isNaN(value) ? "-" : value.toFixed(2)}%
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* ヘッダー部分 */}
      <div className="flex flex-col gap-4">
        <Link
          href="/"
          className="flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          ファンド一覧に戻る
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xl font-bold mb-2">{fund.fundName}</div>
            <div className="text-sm text-gray-500 mb-2">
              ファンドコード: {fund.fundCd}
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleToggleFavorite}>
              <Star
                className={`mr-1 h-4 w-4 ${
                  isFavorite ? "fill-yellow-400" : ""
                }`}
              />
              お気に入り
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
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                基準価額
              </h3>
              <p className="text-2xl font-bold">
                {Number(fund.nav).toLocaleString()} 円
              </p>
              <div className="text-sm text-gray-500 mb-2">
                基準日: {fund.baseDate}
              </div>{" "}
              現在
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                前日比
              </h3>
              <p className="text-2xl font-bold flex items-center">
                <div>
                  前日比: {renderPriceChange(fund.netassetsChangeCmpPrevDay)}
                  <span className="ml-2 text-xs text-gray-500">
                    ({fund.cmpPrevDay})
                  </span>
                </div>
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                純資産総額
              </h3>
              <p className="text-2xl font-bold">
                {Number(fund.netassets).toLocaleString()} 円
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* タブコンテンツ */}
      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="performance">パフォーマンス</TabsTrigger>
          <TabsTrigger value="risk">リスク指標</TabsTrigger>
        </TabsList>

        {/* パフォーマンスタブ */}
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>期間別リターン</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    1ヶ月
                  </h3>
                  <div className="flex flex-col gap-2">
                    <div>
                      1ヶ月: {renderPriceChange(fund.percentageChange1m)}
                    </div>
                    <div>
                      3ヶ月: {renderPriceChange(fund.percentageChange3m)}
                    </div>
                    <div>
                      6ヶ月: {renderPriceChange(fund.percentageChange6m)}
                    </div>
                    <div>1年: {renderPriceChange(fund.percentageChange1y)}</div>
                    <div>3年: {renderPriceChange(fund.percentageChange3y)}</div>
                  </div>
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
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    標準偏差
                  </h3>
                  <p className="text-xl font-bold">{fund.risk1y}%</p>
                  <p className="text-xs text-muted-foreground">
                    値動きの大きさを示す指標
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    シャープレシオ
                  </h3>
                  <div>リスク（1年）: {fund.risk1y}</div>
                  <div>シャープレシオ（1年）: {fund.riskReturn1y}</div>
                  <div>リスク（全期間）: {fund.riskFull}</div>
                  <p className="text-xs text-muted-foreground">
                    リスクあたりのリターンを示す指標
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    最大ドローダウン
                  </h3>
                  <p className="text-xl font-bold">{fund.riskFull}%</p>
                  <p className="text-xs text-muted-foreground">
                    過去の最大下落率
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
