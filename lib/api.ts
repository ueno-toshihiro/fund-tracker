import { mockFunds } from "./mock-data"
import { mockFundDetails } from "./mock-fund-details"

export interface Fund {
  fundCode: string
  fundName: string
  basePrice: number
  basePriceDate: string
  priceChanges: {
    day1: number
    day2: number
    day3: number
    day4: number
    day5: number
  }
}

export interface PerformanceData {
  dates: string[]
  prices: number[]
  benchmark: number[]
}

export interface FundDetail extends Fund {
  priceChanges: {
    day1: number
    day2: number
    day3: number
    day4: number
    day5: number
    day1Amount: number
  }
  netAssets: number
  returns: {
    oneMonth: number
    threeMonths: number
    sixMonths: number
    oneYear: number
    threeYears: number
  }
  risk: {
    standardDeviation: number
    sharpeRatio: number
    maxDrawdown: number
  }
  fees: {
    purchaseFee: string
    redemptionFee: string
    managementFee: number
    managementFeeBreakdown: {
      company: number
      distributor: number
      trustee: number
    }
  }
  info: {
    inceptionDate: string
    maturityDate: string
    dividendFrequency: string
    benchmark: string
    description: string
  }
  performanceData: PerformanceData
}

export async function getFunds(): Promise<Fund[]> {
  try {
    // MUFG Asset Management APIのエンドポイント
    const response = await fetch("https://www.am.mufg.jp/fund/api/v1/funds", {
      // 実際のAPIが利用可能になったら以下のオプションを調整してください
      cache: "no-store",
    })

    if (!response.ok) {
      // APIが利用できない場合はモックデータを返す
      console.warn("API unavailable, using mock data")
      return mockFunds
    }

    const data = await response.json()

    // APIレスポンスを整形して返す
    // 注: 実際のAPIレスポンス形式に合わせて調整が必要です
    return data.funds.map((fund: any) => ({
      fundCode: fund.fund_cd,
      fundName: fund.fund_name,
      basePrice: fund.base_price,
      basePriceDate: fund.base_price_date,
      priceChanges: {
        day1: fund.price_change_1d || 0,
        day2: fund.price_change_2d || 0,
        day3: fund.price_change_3d || 0,
        day4: fund.price_change_4d || 0,
        day5: fund.price_change_5d || 0,
      },
    }))
  } catch (error) {
    console.error("Error fetching fund data:", error)
    // エラー時はモックデータを返す
    return mockFunds
  }
}

export async function getFundDetail(fundCode: string): Promise<FundDetail | null> {
  try {
    // MUFG Asset Management APIのエンドポイント
    const response = await fetch(`https://www.am.mufg.jp/fund/api/v1/funds/${fundCode}`, {
      cache: "no-store",
    })

    if (!response.ok) {
      // APIが利用できない場合はモックデータを返す
      console.warn("API unavailable, using mock data")
      const mockDetail = mockFundDetails.find((fund) => fund.fundCode === fundCode)
      return mockDetail || null
    }

    const data = await response.json()

    // APIレスポンスを整形して返す
    // 注: 実際のAPIレスポンス形式に合わせて調整が必要です
    return {
      fundCode: data.fund_cd,
      fundName: data.fund_name,
      basePrice: data.base_price,
      basePriceDate: data.base_price_date,
      priceChanges: {
        day1: data.price_change_1d || 0,
        day2: data.price_change_2d || 0,
        day3: data.price_change_3d || 0,
        day4: data.price_change_4d || 0,
        day5: data.price_change_5d || 0,
        day1Amount: data.price_change_1d_amount || 0,
      },
      netAssets: data.net_assets,
      returns: {
        oneMonth: data.returns.one_month,
        threeMonths: data.returns.three_months,
        sixMonths: data.returns.six_months,
        oneYear: data.returns.one_year,
        threeYears: data.returns.three_years,
      },
      risk: {
        standardDeviation: data.risk.standard_deviation,
        sharpeRatio: data.risk.sharpe_ratio,
        maxDrawdown: data.risk.max_drawdown,
      },
      fees: {
        purchaseFee: data.fees.purchase_fee,
        redemptionFee: data.fees.redemption_fee,
        managementFee: data.fees.management_fee,
        managementFeeBreakdown: {
          company: data.fees.management_fee_breakdown.company,
          distributor: data.fees.management_fee_breakdown.distributor,
          trustee: data.fees.management_fee_breakdown.trustee,
        },
      },
      info: {
        inceptionDate: data.info.inception_date,
        maturityDate: data.info.maturity_date,
        dividendFrequency: data.info.dividend_frequency,
        benchmark: data.info.benchmark,
        description: data.info.description,
      },
      performanceData: {
        dates: data.performance_data.dates,
        prices: data.performance_data.prices,
        benchmark: data.performance_data.benchmark,
      },
    }
  } catch (error) {
    console.error("Error fetching fund detail:", error)
    // エラー時はモックデータを返す
    const mockDetail = mockFundDetails.find((fund) => fund.fundCode === fundCode)
    return mockDetail || null
  }
}
