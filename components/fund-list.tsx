"use client";

import { useState, useMemo, useLayoutEffect } from "react";
import type { Fund } from "@/lib/api";
import { getFavorites, toggleFavorite } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Star, ArrowUpDown } from "lucide-react";
import FundListTable from "./fund-list-table";

type SortField =
  | "fundName"
  | "basePrice"
  | "cmpPrevDay"
  | "netassetsChangeCmpPrevDay"
  | "percentageChange1m"
  | "percentageChange3m"
  | "percentageChange6m"
  | "percentageChange1y"
  | "percentageChange3y";
type SortDirection = "asc" | "desc";

interface FundListProps {
  initialFunds: Fund[];
}
export default function FundList({ initialFunds }: FundListProps) {
  const [funds] = useState<Fund[]>(initialFunds);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("fundName");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [filterFavorites, setFilterFavorites] = useState(false);
  const [useLocalStorage, setUseLocalStorage] = useState(false);

  // お気に入り一覧の切り替え
  const favoritesFilterToggleHandler = async () => {
    // ローカルストレージにお気に入りフィルタの状態を保存する
    localStorage.setItem("filterFavorites", String(!filterFavorites));
    setFilterFavorites(!filterFavorites);
  };

  useLayoutEffect(() => {
    // ローカルストレージからお気に入りフィルタの状態を読み出す
    const savedFilterFavorites = localStorage.getItem("filterFavorites");
    if (savedFilterFavorites !== null) {
      setFilterFavorites(JSON.parse(savedFilterFavorites));
    }
    // Redisからお気に入り一覧を取得
    getFavorites().then((result) => {
      if (result) {
        setFavorites(result);
      }
    });
  }, []);

  // 各ファンドのお気に入り切り替え
  const handleToggleFavorite = async (fundCode: string) => {
    // ローカルストレージを使用する場合
    if (useLocalStorage) {
      const newFavorites = favorites.includes(fundCode)
        ? favorites.filter((code) => code !== fundCode)
        : [...favorites, fundCode];

      setFavorites(newFavorites);
      return;
    }

    // サーバーアクションを使用する場合
    const result = await toggleFavorite(fundCode);

    if (result.success) {
      if (result.useLocalStorage) {
        // Redisが利用できない場合はローカルストレージに切り替え
        setUseLocalStorage(true);
        const newFavorites = favorites.includes(fundCode)
          ? favorites.filter((code) => code !== fundCode)
          : [...favorites, fundCode];

        setFavorites(newFavorites);
      } else if (result.isFavorite !== null) {
        // 通常のRedis処理
        if (result.isFavorite) {
          setFavorites([...favorites, fundCode]);
        } else {
          setFavorites(favorites.filter((code) => code !== fundCode));
        }
      }
      return;
    }

    // エラーが発生した場合はローカルストレージに切り替え
    setUseLocalStorage(true);
    const newFavorites = favorites.includes(fundCode)
      ? favorites.filter((code) => code !== fundCode)
      : [...favorites, fundCode];

    setFavorites(newFavorites);
  };

  // ソート切り替え
  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Load searchTerm from local storage on component mount
  useLayoutEffect(() => {
    const savedSearchTerm = localStorage.getItem("searchTerm");
    if (savedSearchTerm) {
      setSearchTerm(savedSearchTerm);
    }
  }, []);

  // フィルタリングとソートを適用したファンドリスト
  const filteredAndSortedFunds = useMemo(() => {
    let result = [...funds];

    // 検索フィルタリング
    if (searchTerm) {
      result = result.filter(
        (fund) =>
          fund.fundName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          fund.fundCode.includes(searchTerm)
      );
    }

    // お気に入りフィルタリング
    if (filterFavorites) {
      result = result.filter((fund) => favorites.includes(fund.fundCode));
    }

    // ソート
    result.sort((a, b) => {
      let valueA, valueB;

      switch (sortField) {
        case "fundName":
          valueA = a.fundName;
          valueB = b.fundName;
          break;
        case "basePrice":
          valueA = a.basePrice;
          valueB = b.basePrice;
          break;
        case "cmpPrevDay":
          valueA = a.priceChanges.cmpPrevDay;
          valueB = b.priceChanges.cmpPrevDay;
          break;
        case "netassetsChangeCmpPrevDay":
          valueA = a.priceChanges.netassetsChangeCmpPrevDay;
          valueB = b.priceChanges.netassetsChangeCmpPrevDay;
          break;
        case "percentageChange1m":
          valueA = a.priceChanges.percentageChange1m;
          valueB = b.priceChanges.percentageChange1m;
          break;
        case "percentageChange3m":
          valueA = a.priceChanges.percentageChange3m;
          valueB = b.priceChanges.percentageChange3m;
          break;
        case "percentageChange6m":
          valueA = a.priceChanges.percentageChange6m;
          valueB = b.priceChanges.percentageChange6m;
          break;
        case "percentageChange1y":
          valueA = a.priceChanges.percentageChange1y;
          valueB = b.priceChanges.percentageChange1y;
          break;
        case "percentageChange3y":
          valueA = a.priceChanges.percentageChange3y;
          valueB = b.priceChanges.percentageChange3y;
          break;
        default:
          valueA = a.fundName;
          valueB = b.fundName;
      }

      if (typeof valueA === "string" && typeof valueB === "string") {
        return sortDirection === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      } else {
        if (typeof valueA !== "number" || typeof valueB !== "number") {
          return 0;
        }
        return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
      }
    });

    return result;
  }, [funds, searchTerm, filterFavorites, favorites, sortField, sortDirection]);

  const searchTermHandler = (value: string) => {
    setSearchTerm(value);
    localStorage.setItem("searchTerm", value);
  };

  return (
    <div className="space-y-4">
      {useLocalStorage && (
        <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-md text-sm text-yellow-800">
          注意: Vercel
          Redisが設定されていないため、お気に入りはローカルストレージに保存されます。
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex-1">
          <Input
            placeholder="ファンド名または証券コードで検索"
            value={searchTerm}
            onChange={(e) => searchTermHandler(e.target.value)}
            className="max-w-md"
          />
        </div>
        <div className="flex gap-2 items-center">
          <Button
            variant={filterFavorites ? "default" : "outline"}
            onClick={favoritesFilterToggleHandler}
            className="flex items-center gap-1"
          >
            <Star
              className={`h-4 w-4 ${filterFavorites ? "fill-yellow-400" : ""}`}
            />
            お気に入り
          </Button>
          <Select
            value={sortField}
            onValueChange={(value) => handleSort(value as SortField)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="並び替え" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fundName">ファンド名</SelectItem>
              <SelectItem value="basePrice">基準価格</SelectItem>
              <SelectItem value="cmpPrevDay">前日比（円）</SelectItem>
              <SelectItem value="netassetsChangeCmpPrevDay">
                前日比（%）
              </SelectItem>
              <SelectItem value="percentageChange1m">1ヶ月（%）</SelectItem>
              <SelectItem value="percentageChange3m">3ヶ月（%）</SelectItem>
              <SelectItem value="percentageChange6m">6ヶ月（%）</SelectItem>
              <SelectItem value="percentageChange1y">1年（%）</SelectItem>
              <SelectItem value="percentageChange3y">3年（%）</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              setSortDirection(sortDirection === "asc" ? "desc" : "asc")
            }
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* ファンド一覧 Table */}
      <FundListTable
        filteredAndSortedFunds={filteredAndSortedFunds}
        favorites={favorites}
        handleToggleFavorite={handleToggleFavorite}
      />
    </div>
  );
}
