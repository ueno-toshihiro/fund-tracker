import type { Fund } from "./api"

// APIが利用できない場合のモックデータ
export const mockFunds: Fund[] = [
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
    },
  },
  {
    fundCode: "03311174",
    fundName: "eMAXIS Slim 国内株式(TOPIX)",
    basePrice: 13785,
    basePriceDate: "2023-04-12",
    priceChanges: {
      day1: -0.25,
      day2: 0.34,
      day3: -0.12,
      day4: 0.56,
      day5: 0.78,
    },
  },
  {
    fundCode: "03311175",
    fundName: "eMAXIS Slim 先進国株式インデックス",
    basePrice: 15632,
    basePriceDate: "2023-04-12",
    priceChanges: {
      day1: 0.42,
      day2: -0.18,
      day3: 0.65,
      day4: 0.92,
      day5: -0.23,
    },
  },
  {
    fundCode: "03311176",
    fundName: "eMAXIS Slim 新興国株式インデックス",
    basePrice: 11245,
    basePriceDate: "2023-04-12",
    priceChanges: {
      day1: -0.45,
      day2: -0.67,
      day3: 0.89,
      day4: 1.12,
      day5: -0.56,
    },
  },
  {
    fundCode: "03311177",
    fundName: "eMAXIS Slim 国内債券インデックス",
    basePrice: 10234,
    basePriceDate: "2023-04-12",
    priceChanges: {
      day1: 0.05,
      day2: 0.08,
      day3: -0.03,
      day4: 0.12,
      day5: 0.07,
    },
  },
  {
    fundCode: "03311178",
    fundName: "eMAXIS Slim 先進国債券インデックス",
    basePrice: 10876,
    basePriceDate: "2023-04-12",
    priceChanges: {
      day1: 0.12,
      day2: 0.15,
      day3: -0.08,
      day4: 0.21,
      day5: 0.09,
    },
  },
]
