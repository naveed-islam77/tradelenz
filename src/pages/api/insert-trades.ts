import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

interface TradeInsert {
  pair: string;
  type: "buy" | "sell";
  entry: number;
  exit: number | null;
  stop_loss: number | null;
  take_profit: number | null;
  lot_size: number;
  date_open: string;
  date_close: string | null;
  strategy: string | null;
  notes: string | null;
  emotion: string | null;
  session: string | null;
  confirmations: string[] | null;
  result: number | null;
  timeframe: string | null;
  tradetype: string | null;
  account_id: string | null;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    console.log("trades")

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { trades } = req.body as { trades: TradeInsert[] };


    if (!Array.isArray(trades) || trades.length === 0) {
      return res.status(400).json({ error: "No trades provided" });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error } = await supabase
      .from("trades")
      .insert(trades);

    if (error) {
      console.error("Supabase Insert Error:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({
      success: true,
      inserted: trades.length,
    });
  } catch (error) {
    console.error("API error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
