import { Button } from "@/components/ui/button";
import { calculatePips } from "@/helpers/trade-helpers";
import {
  emotions,
  pairs,
  setups,
  tradeType,
  tradingSessions,
} from "@/static/trades-data";
import { Trade } from "@/types/trade-form";
import { Loader2, X } from "lucide-react";
import { KeyboardEvent, useState } from "react";
import { Input } from "./ui/input";
import Selector from "./ui/selector";
import { useAddTradeMutation } from "@/redux/services/tradesApi";
import toast from "react-hot-toast";
import { DateTimePicker } from "./ui/DateTimePicker";
import dayjs from "dayjs";
import { useFormik } from "formik";

const initialValues = {
  date_open: "",
  date_close: "",
  pair: "EURUSD",
  type: "buy",
  entry: "",
  exit: "",
  stop_loss: "",
  take_profit: "",
  lot_size: "",
  strategy: "",
  notes: "",
  confirmations: [],
  emotion: "",
  result: "",
  session: "",
  timeframe: "",
  tradetype: "",
};

export default function TradeForm() {
  const [confirmations, setConfirmations] = useState<string[]>([]);
  const [confirmationInput, setConfirmationInput] = useState("");
  const [addTrade, { isLoading }] = useAddTradeMutation();

  const formik = useFormik({
    initialValues,
    onSubmit: (values, { resetForm }) => {
      const newTrade: Trade = {
        date_open: values.date_open,
        date_close: values.date_close,
        pair: values.pair,
        type: values.type as "buy" | "sell",
        entry: Number(values.entry),
        exit: Number(values.exit),
        stop_loss: Number(values.stop_loss),
        take_profit: Number(values.take_profit),
        lot_size: Number(values.lot_size),
        result: values.result,
        strategy: values.strategy,
        notes: values.notes,
        confirmations: confirmations,
        emotion: values.emotion,
        session: values.session,
        timeframe: values.timeframe,
        tradetype: values.tradetype,
      };

      addTrade(newTrade)
        .unwrap()
        .then(() => {
          toast.success("Trade added successfully!");
          resetForm();
          setConfirmations([]);
        })
        .catch(() => toast.error("Error adding trade"));
    },
  });

  const handleConfirmationKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const value = confirmationInput.trim();
      if (value && !confirmations.includes(value)) {
        setConfirmations([...confirmations, value]);
      }
      setConfirmationInput("");
    }
  };

  const removeConfirmation = (value: string) => {
    setConfirmations(confirmations.filter((c) => c !== value));
  };

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      {/* Date & Time Section */}
      <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
        <h3 className="text-sm font-semibold text-foreground mb-4">
          Date & Time
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Trade Open
            </label>
            <DateTimePicker
              date={
                formik.values.date_open
                  ? dayjs(formik.values.date_open).toDate()
                  : null
              }
              setDate={(date) =>
                formik.setFieldValue("date_open", dayjs(date).toISOString())
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Trade Close
            </label>
            <DateTimePicker
              date={
                formik.values.date_close
                  ? dayjs(formik.values.date_close).toDate()
                  : null
              }
              setDate={(date) =>
                formik.setFieldValue("date_close", dayjs(date).toISOString())
              }
            />
          </div>
        </div>
      </div>

      {/* Pair & Type Section */}
      <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
        <h3 className="text-sm font-semibold text-foreground mb-4">
          Trade Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Selector
            options={pairs}
            onChange={(value) => formik.setFieldValue("pair", value)}
            value={formik.values.pair}
            label="Pair / Instrument"
            triggerClassName="focus-visible:ring-[0px] bg-input p-2 py-5 mt-2"
            parentClassName="p-0"
          />

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Trade Type
            </label>
            <div className="flex gap-2">
              {(["buy", "sell"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => formik.setFieldValue("type", type)}
                  className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                    formik.values.type === type
                      ? type === "buy"
                        ? "bg-accent text-accent-foreground"
                        : "bg-destructive text-destructive-foreground"
                      : "bg-muted text-muted-foreground border border-border"
                  }`}
                >
                  {type === "buy" ? "↑ Buy" : "↓ Sell"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Price Section */}
      <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
        <h3 className="text-sm font-semibold text-foreground mb-4">
          Price Levels
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["entry", "exit", "stop_loss", "take_profit"].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-foreground mb-2">
                {field.replace("_", " ").toUpperCase()}
              </label>
              <input
                type="number"
                placeholder="4537.54"
                name={field}
                value={(formik.values as any)[field]}
                onChange={formik.handleChange}
                step="0.0001"
                className="w-full px-4 py-2 bg-input border border-border rounded-lg"
                required
              />
            </div>
          ))}
        </div>
      </div>

      {/* Volume & Setup Section */}
      <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
        <h3 className="text-sm font-semibold text-foreground mb-4">
          Volume & Strategy
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Lot Size
            </label>
            <input
              type="number"
              name="lot_size"
              placeholder="0.01"
              value={formik.values.lot_size}
              onChange={formik.handleChange}
              step="0.1"
              className="w-full px-4 py-2 bg-input border border-border rounded-lg"
              required
            />
          </div>

          <Selector
            options={setups}
            onChange={(value) => formik.setFieldValue("strategy", value)}
            value={formik.values.strategy}
            label="Setup / Strategy"
            triggerClassName="focus-visible:ring-[0px] bg-input p-2 py-5 mt-2"
            parentClassName="p-0"
          />

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              TimeFrame
            </label>
            <input
              type="text"
              name="timeframe"
              placeholder="15"
              value={formik.values.timeframe}
              onChange={formik.handleChange}
              className="w-full px-4 py-2 bg-input border border-border rounded-lg"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          <Selector
            options={emotions}
            onChange={(value) => formik.setFieldValue("emotion", value)}
            value={formik.values.emotion}
            label="Emotion"
            triggerClassName="focus-visible:ring-[0px] bg-input p-2 py-5 mt-2"
            parentClassName="p-0"
          />

          <Selector
            options={tradingSessions}
            onChange={(value) => formik.setFieldValue("session", value)}
            value={formik.values.session}
            label="Session"
            triggerClassName="focus-visible:ring-[0px] bg-input p-2 py-5 mt-2"
            parentClassName="p-0"
          />

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Result
            </label>
            <Input
              type="number"
              name="result"
              value={formik.values.result}
              onChange={formik.handleChange}
              className="w-full bg-input"
              placeholder="Enter Trade Result"
            />
          </div>
          <Selector
            options={tradeType}
            onChange={(value) => formik.setFieldValue("tradetype", value)}
            value={formik.values.tradetype}
            label="Trade Type"
            triggerClassName="focus-visible:ring-[0px] bg-input p-2 py-5 mt-2"
            parentClassName="p-0"
            placeholder="Scalping"
          />
        </div>
      </div>

      {/* Confirmations */}
      <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
        <label className="block text-sm font-medium text-foreground mb-2">
          Confirmations
        </label>

        <Input
          placeholder="Enter confirmation and press Enter"
          value={confirmationInput}
          onChange={(e) => setConfirmationInput(e.target.value)}
          onKeyDown={handleConfirmationKeyDown}
          className="w-full bg-input"
        />

        <div className="flex flex-wrap gap-2 mt-2">
          {confirmations.map((c) => (
            <div
              key={c}
              className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm"
            >
              {c}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => removeConfirmation(c)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
        <label className="block text-sm font-medium text-foreground mb-2">
          Trade Notes
        </label>
        <textarea
          name="notes"
          value={formik.values.notes}
          onChange={formik.handleChange}
          rows={4}
          className="w-full px-4 py-2 bg-input border border-border rounded-lg resize-none"
          placeholder="Document your trade rationale..."
        />
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <Button
          type="submit"
          className="bg-accent hover:bg-accent text-primary-foreground w-[100px]"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : "Save Trade"}
        </Button>
      </div>
    </form>
  );
}
