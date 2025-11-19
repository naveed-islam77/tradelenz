import { Button } from "@/components/ui/button";
import Selector from "@/components/ui/selector";
import { pairs } from "@/static/trades-data";
import { useState } from "react";
import { DateTimePicker } from "../ui/DateTimePicker";
import { X } from "lucide-react";
import dayjs from "dayjs";

export default function DashboardHeader({ onFilter }: any) {
  const [filterField, setFilterField] = useState<"Date" | "Pair" | "Type">(
    "Pair"
  );
  const [filterValue, setFilterValue] = useState<string | Date | null>("");

  const handleApplyFilter = () => {
    if (!filterValue) return;
    onFilter(filterField, filterValue);
  };

  const handleRemoveFilter = () => {
    setFilterValue("");
    onFilter(null);
  };

  const options = () => {
    if (filterField === "Pair") return pairs;
    if (filterField === "Type") return ["buy", "sell"];
    return [];
  };

  const renderFilterLabel = () => {
    if (!filterValue) return null;

    let label = "";
    if (filterField === "Date" && filterValue instanceof Date) {
      label = dayjs(filterValue).format("DD/MM/YYYY");
    } else {
      label = filterValue.toString();
    }

    return (
      <div className="flex items-center gap-2 bg-gray-200 px-3 py-1 rounded-full text-sm w-max">
        <span>{`${filterField}: ${label}`}</span>
        <X className="w-4 h-4 cursor-pointer" onClick={handleRemoveFilter} />
      </div>
    );
  };

  return (
    <div className="flex flex-col space-y-2 mb-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-1">
            Weekly Trades
          </h2>
          <p className="text-muted-foreground">
            Click on any trade to see detailed information
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Selector
              value={filterField}
              onChange={(value: any) => {
                setFilterField(value);
                setFilterValue("");
              }}
              options={["Date", "Pair", "Type"]}
              placeholder="Filter By"
              triggerClassName="border px-2"
              parentClassName="p-0 m-0"
            />

            {filterField === "Date" ? (
              <DateTimePicker
                date={filterValue instanceof Date ? filterValue : new Date()}
                setDate={(date) => setFilterValue(date)}
              />
            ) : (
              <Selector
                value={filterValue as string}
                onChange={setFilterValue}
                options={options()}
                placeholder={`Search ${filterField}`}
                triggerClassName="border px-2"
                parentClassName="p-0 m-0"
              />
            )}

            <Button variant="default" onClick={handleApplyFilter}>
              Apply Filter
            </Button>
          </div>
          {renderFilterLabel()}
        </div>
      </div>

      {/* Active Filter */}
    </div>
  );
}
