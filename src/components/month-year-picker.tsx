import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function MonthYearPicker({ date, setDate }: any) {
  return (
    <DatePicker
      selected={date}
      onChange={(d) => setDate(d)}
      dateFormat="MM/yyyy"
      showMonthYearPicker
      placeholderText="Select month and year"
      className="border p-2 rounded-md"
    />
  );
}
