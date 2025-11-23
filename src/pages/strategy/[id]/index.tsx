import StrategyForm from "@/components/stratergies/StrategyForm";
import { useRouter } from "next/router";
import React from "react";

const EditStrategy = () => {
  const router = useRouter();
  const { id } = router.query;
  return (
    <div>
      <StrategyForm tradeId={id as string} />
    </div>
  );
};

export default EditStrategy;
