import { Button } from "@/components/ui/button";
import { calculatePips } from "@/helpers/trade-helpers";
import { pairs, setups } from "@/static/trades-data";
import { Trade } from "@/types/trade-form";
import { Loader2, X } from "lucide-react";
import { KeyboardEvent, useState } from "react";
import { Input } from "./ui/input";
import Selector from "./ui/selector";
import { useAddTradeMutation } from "@/redux/services/tradesApi";
import toast from "react-hot-toast";

export default function TradeForm() {
  const [confirmations, setConfirmations] = useState<string[]>([]);
  const [confirmationInput, setConfirmationInput] = useState("");
  const [addTrade, { isLoading }] = useAddTradeMutation();
  const [formData, setFormData] = useState({
    date_open: new Date().toISOString().slice(0, 16),
    date_close: new Date().toISOString().slice(0, 16),
    pair: "EURUSD",
    type: "buy" as const,
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
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const entry = parseFloat(formData.entry);
    const exit = parseFloat(formData.exit);
    const lot = parseFloat(formData.lot_size) || 1;

    const newTrade: Trade = {
      date_open: formData.date_open,
      pair: formData.pair,
      type: formData.type,
      entry: entry,
      exit: exit,
      stop_loss: parseFloat(formData.stop_loss),
      take_profit: parseFloat(formData.take_profit),
      lot_size: lot,
      result: formData.result,
      strategy: formData.strategy,
      notes: formData.notes,
      confirmations: confirmations,
      emotion: formData.emotion,
      session: formData.session,
    };

    addTrade(newTrade)
      .unwrap()
      .then(() => {
        toast.success("Trade added successfully!");
        setFormData({
          date_open: new Date().toISOString().slice(0, 16),
          date_close: new Date().toISOString().slice(0, 16),
          pair: "EURUSD",
          type: "buy",
          entry: "",
          exit: "",
          stop_loss: "",
          take_profit: "",
          result: "",
          lot_size: "",
          strategy: "",
          notes: "",
          confirmations: [],
          emotion: "",
          session: "",
        });
        setConfirmations([]);
      })
      .catch((error) => {
        console.error("Error adding trade:", error);
        toast.error("An error occurred while adding the trade.");
      });
  };

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

  console.log("formData", formData.confirmations);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
            <input
              type="datetime-local"
              name="date_open"
              value={formData.date_open}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Trade Close
            </label>
            <input
              type="datetime-local"
              name="date_close"
              value={formData.date_close}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
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
            onChange={(value) => setFormData({ ...formData, pair: value })}
            value={formData.pair}
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
                  onClick={() =>
                    setFormData((prev: any) => ({ ...prev, type: type }))
                  }
                  className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                    formData.type === type
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
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Entry Price
            </label>
            <input
              type="number"
              name="entry"
              value={formData.entry}
              onChange={handleInputChange}
              placeholder="1.0850"
              step="0.0001"
              className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Exit Price
            </label>
            <input
              type="number"
              name="exit"
              value={formData.exit}
              onChange={handleInputChange}
              placeholder="1.0875"
              step="0.0001"
              className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Stop Loss (SL)
            </label>
            <input
              type="number"
              name="stop_loss"
              value={formData.stop_loss}
              onChange={handleInputChange}
              placeholder="1.0825"
              step="0.0001"
              className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Take Profit (TP)
            </label>
            <input
              type="number"
              name="take_profit"
              value={formData.take_profit}
              onChange={handleInputChange}
              placeholder="1.0900"
              step="0.0001"
              className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
        </div>
      </div>

      {/* Volume & Setup Section */}
      <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
        <h3 className="text-sm font-semibold text-foreground mb-4">
          Volume & Strategy
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Lot Size
            </label>
            <input
              type="number"
              name="lot_size"
              value={formData.lot_size}
              onChange={handleInputChange}
              placeholder="1.0"
              step="0.1"
              className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div>
            <Selector
              options={setups}
              onChange={(value) =>
                setFormData({ ...formData, strategy: value })
              }
              value={formData.strategy}
              label="Setup / Strategy"
              triggerClassName="focus-visible:ring-[0px] bg-input p-2 py-5 mt-2"
              parentClassName="p-0"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          <div>
            <Selector
              options={setups}
              onChange={(value) => setFormData({ ...formData, emotion: value })}
              value={formData.emotion}
              label="Emotion"
              triggerClassName="focus-visible:ring-[0px] bg-input p-2 py-5 mt-2"
              parentClassName="p-0"
              placeholder="Select emotion type"
            />
          </div>
          <div>
            <Selector
              options={setups}
              onChange={(value) => setFormData({ ...formData, session: value })}
              value={formData.session}
              label="Session"
              triggerClassName="focus-visible:ring-[0px] bg-input p-2 py-5 mt-2"
              parentClassName="p-0"
              placeholder="Select Session"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Result
            </label>
            <Input
              placeholder="Enter Trade Result"
              value={formData.result}
              onChange={(e) =>
                setFormData({ ...formData, result: e.target.value })
              }
              type="number"
              className="w-full focus-visible:ring-0 focus-visible:border-input bg-input"
            />
          </div>
        </div>
      </div>
      {/* Confirmation  */}
      <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
        <label className="block text-sm font-medium text-foreground mb-2">
          Confirmations
        </label>
        <Input
          placeholder="Enter confirmation and press Enter"
          value={confirmationInput}
          onChange={(e) => setConfirmationInput(e.target.value)}
          onKeyDown={handleConfirmationKeyDown}
          className="w-full focus-visible:ring-0 focus-visible:border-input bg-input"
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
      {/* Notes Section */}
      <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
        <label className="block text-sm font-medium text-foreground mb-2">
          Trade Notes
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleInputChange}
          placeholder="Document your trade rationale, market conditions, and lessons learned..."
          rows={4}
          className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button
          type="submit"
          className="bg-accent hover:bg-accent w-[100px] text-primary-foreground font-semibold py-3 rounded-lg transition-all"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : "Save Trade"}
        </Button>
      </div>
    </form>
  );
}
