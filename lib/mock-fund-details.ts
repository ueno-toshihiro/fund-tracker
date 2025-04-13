import type { FundDetail } from "./api"

// 過去1年分の日付を生成
function generateDates(count: number): string[] {
  const dates: string[] = []
  const today = new Date()

  for (let i = count - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(today.getDate() - i * 7) // 週単位でデータを生成
    dates.push(date.toISOString().split("T")[0])
  }

  return dates
}

// 価格データを生成
function generatePrices(basePrice: number, count: number, volatility: number): number[] {
  const prices: number[] = []
  let currentPrice = basePrice

  for (let i = 0; i < count; i++) {
    // ランダムな変動を加える
    const change = (Math.random() - 0.45) * volatility * currentPrice
    currentPrice += change
    prices.push(Math.round(currentPrice))
  }

  return prices
}

// ベンチマークデータを生成
function generateBenchmark(prices: number[], correlation: number): number[] {
  return prices.map((price) => {
    const deviation = (Math.random() - 0.5) * (1 - correlation) * price * 0.1
    return Math.round(price * (1 + deviation))
  })
}

// 日付データ（52週分）
const dates = generateDates(52)

export const mockFundDetails: FundDetail[] = [
  {
    fundCode: "03311081",
    fundName: "eMAXIS Slim 米国株式(S&P500)",
    basePrice: 18326,
    basePriceDate: "2023-04-12",
    priceChanges: {
      day1: 0.45,
      day2: -0.12,
      day3: 0.78,
      day4: 1.23,
      day5: -0.34,
      day1Amount: 82,
    },
    netAssets: 12458.6,
    returns: {
      oneMonth: 2.34,
      threeMonths: 5.67,
      sixMonths: 8.91,
      oneYear: 15.43,
      threeYears: 45.67,
    },
    risk: {
      standardDeviation: 18.45,
      sharpeRatio: 0.87,
      maxDrawdown: -23.56,
    },
    fees: {
      purchaseFee: "なし",
      redemptionFee: "なし",
      managementFee: 0.0968,
      managementFeeBreakdown: {
        company: 0.044,
        distributor: 0.044,
        trustee: 0.0088,
      },
    },
    info: {
      inceptionDate: "2018年5月1日",
      maturityDate: "無期限",
      dividendFrequency: "年1回 1月26日",
      benchmark: "S&P500指数（配当込み、円換算ベース）",
      description:
        "S&P500指数（配当込み、円換算ベース）に連動する投資成果をめざして運用を行います。\n\n米国の株式に投資を行います。\n\nS&P500指数（配当込み、円換算ベース）をベンチマークとします。\n\n原則として、為替ヘッジは行いません。",
    },
    performanceData: {
      dates: dates,
      prices: generatePrices(18326, 52, 0.02),
      benchmark: generateBenchmark(generatePrices(18326, 52, 0.02), 0.95),
    },
  },
  {
    fundCode: "03311189",
    fundName: "eMAXIS Slim 全世界株式(オール・カントリー)",
    basePrice: 14562,
    basePriceDate: "2023-04-12",
    priceChanges: {
      day1: 0.32,
      day2: -0.21,
      day3: 0.54,
      day4: 0.87,
      day5: -0.12,
      day1Amount: 46,
    },
    netAssets: 8765.3,
    returns: {
      oneMonth: 1.98,
      threeMonths: 4.32,
      sixMonths: 7.65,
      oneYear: 12.87,
      threeYears: 38.54,
    },
    risk: {
      standardDeviation: 16.78,
      sharpeRatio: 0.76,
      maxDrawdown: -21.43,
    },
    fees: {
      purchaseFee: "なし",
      redemptionFee: "なし",
      managementFee: 0.1144,
      managementFeeBreakdown: {
        company: 0.052,
        distributor: 0.052,
        trustee: 0.0104,
      },
    },
    info: {
      inceptionDate: "2018年10月16日",
      maturityDate: "無期限",
      dividendFrequency: "年1回 1月26日",
      benchmark: "MSCI オール・カントリー・ワールド・インデックス（配当込み、円換算ベース）",
      description:
        "MSCI オール・カントリー・ワールド・インデックス（配当込み、円換算ベース）に連動する投資成果をめざして運用を行います。\n\n日本を含む先進国および新興国の株式に投資を行います。\n\nMSCI オール・カントリー・ワールド・インデックス（配当込み、円換算ベース）をベンチマークとします。\n\n原則として、為替ヘッジは行いません。",
    },
    performanceData: {
      dates: dates,
      prices: generatePrices(14562, 52, 0.018),
      benchmark: generateBenchmark(generatePrices(14562, 52, 0.018), 0.93),
    },
  },
  {
    fundCode: "03311173",
    fundName: "eMAXIS Slim バランス(8資産均等型)",
    basePrice: 12458,
    basePriceDate: "2023-04-12",
    priceChanges: {
      day1: 0.15,
      day2: -0.08,
      day3: 0.22,
      day4: 0.35,
      day5: -0.05,
      day1Amount: 18,
    },
    netAssets: 5432.1,
    returns: {
      oneMonth: 0.87,
      threeMonths: 2.43,
      sixMonths: 4.56,
      oneYear: 7.89,
      threeYears: 21.45,
    },
    risk: {
      standardDeviation: 9.87,
      sharpeRatio: 0.65,
      maxDrawdown: -15.67,
    },
    fees: {
      purchaseFee: "なし",
      redemptionFee: "なし",
      managementFee: 0.154,
      managementFeeBreakdown: {
        company: 0.07,
        distributor: 0.07,
        trustee: 0.014,
      },
    },
    info: {
      inceptionDate: "2018年3月1日",
      maturityDate: "無期限",
      dividendFrequency: "年1回 1月26日",
      benchmark: "8資産均等型指数",
      description:
        "日本を含む先進国の株式、債券および不動産投資信託証券に投資を行います。\n\n8資産（国内株式、先進国株式、新興国株式、国内債券、先進国債券、新興国債券、国内REIT、先進国REIT）に均等に投資を行います。\n\n基本投資割合は、純資産総額に対して各資産12.5％とします。\n\n原則として、為替ヘッジは行いません。",
    },
    performanceData: {
      dates: dates,
      prices: generatePrices(12458, 52, 0.01),
      benchmark: generateBenchmark(generatePrices(12458, 52, 0.01), 0.97),
    },
  },
]
