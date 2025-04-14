import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import { Star } from "@mui/icons-material";
import Link from "next/link";

// Define a type for the fund
interface Fund {
  fundCode: string;
  fundName: string;
  basePrice: number;
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

// Define props for the component
interface FundListProps {
  filteredAndSortedFunds: Fund[];
  favorites: string[];
  handleToggleFavorite: (fundCode: string) => void;
}

// 価格変動の表示用関数
const renderPriceChange = (change: number) => {
  const color =
    change > 0
      ? "text-green-600"
      : change < 0
      ? "text-red-600"
      : "text-gray-600";
  const prefix = change > 0 ? "+" : "";
  return (
    <span className={color}>
      {prefix}
      {change.toLocaleString()}
    </span>
  );
};

const FundList: React.FC<FundListProps> = ({
  filteredAndSortedFunds,
  favorites,
  handleToggleFavorite,
}) => {
  return (
    <TableContainer
      component={Paper}
      square
      elevation={0}
      style={{ height: "90vh" }}
      className="rounded-md border"
    >
      <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>ファンド名</TableCell>
            <TableCell>基準価格</TableCell>
            <TableCell>前日比（円）</TableCell>
            <TableCell>前日比（%）</TableCell>
            <TableCell>1ヶ月（%）</TableCell>
            <TableCell>3ヶ月（%）</TableCell>
            <TableCell>6ヶ月（%）</TableCell>
            <TableCell>1年（%）</TableCell>
            <TableCell>3年（%）</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredAndSortedFunds.length > 0 ? (
            filteredAndSortedFunds.map((fund) => (
              <TableRow key={fund.fundCode}>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleToggleFavorite(fund.fundCode)}
                  >
                    <Star
                      className={`h-4 w-4 ${
                        favorites.includes(fund.fundCode)
                          ? "fill-yellow-400"
                          : ""
                      }`}
                    />
                  </Button>
                </TableCell>
                <TableCell>
                  <Link
                    href={`/funds/${fund.fundCode}`}
                    className="hover:underline text-primary"
                  >
                    {fund.fundName}
                  </Link>
                  <div className="text-xs text-muted-foreground">
                    {fund.fundCode}
                  </div>
                </TableCell>
                <TableCell>{fund.basePrice.toLocaleString()} 円</TableCell>
                <TableCell>
                  {renderPriceChange(fund.priceChanges.cmpPrevDay)}
                </TableCell>
                <TableCell>
                  {renderPriceChange(
                    fund.priceChanges.netassetsChangeCmpPrevDay
                  )}
                </TableCell>
                <TableCell>
                  {renderPriceChange(fund.priceChanges.percentageChange1m)}
                </TableCell>
                <TableCell>
                  {renderPriceChange(fund.priceChanges.percentageChange3m)}
                </TableCell>
                <TableCell>
                  {renderPriceChange(fund.priceChanges.percentageChange6m)}
                </TableCell>
                <TableCell>
                  {renderPriceChange(fund.priceChanges.percentageChange1y)}
                </TableCell>
                <TableCell>
                  {renderPriceChange(fund.priceChanges.percentageChange3y)}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={10} className="h-24 text-center">
                該当するファンドがありません
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FundList;
