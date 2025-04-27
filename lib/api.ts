import { mockFunds } from "./mock-data";
import { mockFundDetails } from "./mock-fund-details";

export interface Fund {
  fundCode: string;
  fundName: string;
  basePrice: number;
  basePriceDate: string;
  priceChanges: {
    cmpPrevDay: number;
    netassetsChangeCmpPrevDay: number;
    percentageChange1m: number;
    percentageChange3m: number;
    percentageChange6m: number;
    percentageChange1y: number;
    percentageChange3y: number;
  };
}

export interface PerformanceData {
  dates: string[];
  prices: number[];
  benchmark: number[];
}

export interface FundDetail {
  fundCd: string;
  isinCd: string;
  associationFundCd: string;
  baseDate: string;
  fundName: string;
  nav: number;
  cmpPrevDay: string;
  percentageChange: string;
  cancellationPrice: number;
  netassets: number;
  netassetsChangeCmpPrevDay: string;
  percentageChange1m: string;
  percentageChange3m: string;
  percentageChange6m: string;
  percentageChange1y: string;
  percentageChange3y: string;
  percentageChangeFull: string;
  percentageChangeMax1m: string;
  percentageChangeMax3m: string;
  percentageChangeMax6m: string;
  percentageChangeMax1y: string;
  percentageChangeMax3y: string;
  percentageChangeMaxFull: string;
  percentageChangeMin1m: string;
  percentageChangeMin3m: string;
  percentageChangeMin6m: string;
  percentageChangeMin1y: string;
  percentageChangeMin3y: string;
  percentageChangeMinFull: string;
  risk1y: string;
  risk3y: string;
  riskFull: string;
  riskReturn1y: string;
  riskReturn3y: string;
  riskReturnFull: string;
  navMax1m: string;
  navMax1mDt: string;
  navMax3m: string;
  navMax3mDt: string;
  navMax6m: string;
  navMax6mDt: string;
  navMax1y: string;
  navMax1yDt: string;
  navMax3y: string;
  navMax3yDt: string;
  navMaxFull: string;
  navMaxFullDt: string;
  navMin1m: string;
  navMin1mDt: string;
  navMin3m: string;
  navMin3mDt: string;
  navMin6m: string;
  navMin6mDt: string;
  navMin1y: string;
  navMin1yDt: string;
  navMin3y: string;
  navMin3yDt: string;
  navMinFull: string;
  navMinFullDt: string;

  // Add camelCase nested objects
  risk: {
    standardDeviation: string;
    sharpeRatio: string;
    risk3y: string;
    riskFull: string;
    riskReturn3y: string;
    riskReturnFull: string;
    maxDrawdown: number;
  };
}

export async function getFunds(): Promise<Fund[]> {
  try {
    // MUFG Asset Management APIのエンドポイント
    const endpoint = "https://developer.am.mufg.jp/fund_information_all_latest";
    const response = await fetch(endpoint, {
      // 実際のAPIが利用可能になったら以下のオプションを調整してください
      cache: "no-store",
    });
    // https://developer.am.mufg.jp/fund_information_all_latest

    if (!response.ok) {
      // APIが利用できない場合はモックデータを返す
      console.warn("API unavailable, using mock data");
      return mockFunds;
    }

    const data = await response.json();

    // console.log("API response:", data);

    // APIレスポンスを整形して返す
    // 注: 実際のAPIレスポンス形式に合わせて調整が必要です
    return data.datasets.map((fund: any) => ({
      fundCode: fund.fund_cd,
      fundName: fund.fund_name,
      basePrice: fund.nav,
      basePriceDate: fund.base_date,
      priceChanges: {
        cmpPrevDay: Number(fund.cmp_prev_day || 0),
        netassetsChangeCmpPrevDay:
          Number(fund.netassets_change_cmp_prev_day) || 0,
        percentageChange1m: Number(fund.percentage_change_1m) || 0,
        percentageChange3m: Number(fund.percentage_change_3m) || 0,
        percentageChange6m: Number(fund.percentage_change_6m) || 0,
        percentageChange1y: Number(fund.percentage_change_1y) || 0,
        percentageChange3y: Number(fund.percentage_change_3y) || 0,
      },
    }));
  } catch (error) {
    console.error("Error fetching fund data:", error);
    // エラー時はモックデータを返す
    return mockFunds;
  }
}

export async function getFundDetail(
  fundCode: string
): Promise<FundDetail | null> {
  try {
    // MUFG Asset Management APIのエンドポイント
    const response = await fetch(
      `https://developer.am.mufg.jp/fund_information_latest/fund_cd/${fundCode}`,
      {
        cache: "no-store",
      }
    );

    const data = await response.json();
    // console.log("API response: detail", data);

    if (!data.datasets || data.datasets.length === 0) {
      // APIが利用できない場合はモックデータを返す
      console.warn("API unavailable, using mock data");
      const mockDetail = mockFundDetails.find(
        (fund) => fund.fundCd === fundCode
      );
      return mockDetail || null;
    }

    const fundData = data.datasets[0];

    // APIレスポンスを整形して返す
    // 注: 実際のAPIレスポンス形式に合わせて調整が必要です
    return {
      fundCd: fundData.fund_cd,
      isinCd: fundData.isin_cd,
      associationFundCd: fundData.association_fund_cd,
      baseDate: fundData.base_date,
      fundName: fundData.fund_name,
      nav: fundData.nav,
      cmpPrevDay: fundData.cmp_prev_day,
      percentageChange: fundData.percentage_change,
      cancellationPrice: fundData.cancellation_price,
      netassets: fundData.netassets,
      netassetsChangeCmpPrevDay: fundData.netassets_change_cmp_prev_day,
      percentageChange1m: fundData.percentage_change_1m,
      percentageChange3m: fundData.percentage_change_3m,
      percentageChange6m: fundData.percentage_change_6m,
      percentageChange1y: fundData.percentage_change_1y,
      percentageChange3y: fundData.percentage_change_3y,
      percentageChangeFull: fundData.percentage_change_full,
      percentageChangeMax1m: fundData.percentage_change_max_1m,
      percentageChangeMax3m: fundData.percentage_change_max_3m,
      percentageChangeMax6m: fundData.percentage_change_max_6m,
      percentageChangeMax1y: fundData.percentage_change_max_1y,
      percentageChangeMax3y: fundData.percentage_change_max_3y,
      percentageChangeMaxFull: fundData.percentage_change_max_full,
      percentageChangeMin1m: fundData.percentage_change_min_1m,
      percentageChangeMin3m: fundData.percentage_change_min_3m,
      percentageChangeMin6m: fundData.percentage_change_min_6m,
      percentageChangeMin1y: fundData.percentage_change_min_1y,
      percentageChangeMin3y: fundData.percentage_change_min_3y,
      percentageChangeMinFull: fundData.percentage_change_min_full,
      risk1y: fundData.risk_1y,
      risk3y: fundData.risk_3y,
      riskFull: fundData.risk_full,
      riskReturn1y: fundData.risk_return_1y,
      riskReturn3y: fundData.risk_return_3y,
      riskReturnFull: fundData.risk_return_full,
      navMax1m: fundData.nav_max_1m,
      navMax1mDt: fundData.nav_max_1m_dt,
      navMax3m: fundData.nav_max_3m,
      navMax3mDt: fundData.nav_max_3m_dt,
      navMax6m: fundData.nav_max_6m,
      navMax6mDt: fundData.nav_max_6m_dt,
      navMax1y: fundData.nav_max_1y,
      navMax1yDt: fundData.nav_max_1y_dt,
      navMax3y: fundData.nav_max_3y,
      navMax3yDt: fundData.nav_max_3y_dt,
      navMaxFull: fundData.nav_max_full,
      navMaxFullDt: fundData.nav_max_full_dt,
      navMin1m: fundData.nav_min_1m,
      navMin1mDt: fundData.nav_min_1m_dt,
      navMin3m: fundData.nav_min_3m,
      navMin3mDt: fundData.nav_min_3m_dt,
      navMin6m: fundData.nav_min_6m,
      navMin6mDt: fundData.nav_min_6m_dt,
      navMin1y: fundData.nav_min_1y,
      navMin1yDt: fundData.nav_min_1y_dt,
      navMin3y: fundData.nav_min_3y,
      navMin3yDt: fundData.nav_min_3y_dt,
      navMinFull: fundData.nav_min_full,
      navMinFullDt: fundData.nav_min_full_dt,
      risk: {
        standardDeviation: fundData.risk_1y,
        sharpeRatio: fundData.risk_return_1y,
        risk3y: fundData.risk_3y,
        riskFull: fundData.risk_full,
        riskReturn3y: fundData.risk_return_3y,
        riskReturnFull: fundData.risk_return_full,
        maxDrawdown: fundData.risk?.max_drawdown,
      },
    };
  } catch (error) {
    console.error("Error fetching fund detail:", error);
    // エラー時はモックデータを返す
    const mockDetail = mockFundDetails.find((fund) => fund.fundCd === fundCode);
    return mockDetail || null;
  }
}
