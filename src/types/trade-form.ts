export interface Trade {
  id?: string;
  date_open: string;
  date_close?: string;
  pair: string;
  type: "buy" | "sell";
  entry: number;
  exit?: number;
  stop_loss?: number;
  take_profit?: number;
  lot_size: number;
  result: string;
  strategy?: string;
  notes?: string;
  emotion?: string;
  session?: string;
  confirmations?: string[];
}


export interface TradeFormProps {
  onAddTrade: (trade: Trade) => void;
}
