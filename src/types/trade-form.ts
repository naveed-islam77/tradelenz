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
  timeframe?: string;
  notes?: string;
  emotion?: string;
  session?: string;
  confirmations?: string[];
  tradetype?: string;
  strategy_id?: string;
}


export interface TradeFormProps {
  onAddTrade: (trade: Trade) => void;
}
