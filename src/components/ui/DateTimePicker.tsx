"use client";

import { ChevronDownIcon } from "lucide-react";
import * as React from "react";
import dayjs from "dayjs";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DateTimePicker({
  date,
  setDate,
}: {
  date: any;
  setDate: React.Dispatch<React.SetStateAction<any>>;
}) {
  const [open, setOpen] = React.useState(false);
  const [time, setTime] = React.useState(
    date ? dayjs(date).format("HH:mm:ss") : "10:30:00"
  );

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setTime(newTime);

    if (date) {
      const [hours, minutes, seconds] = newTime.split(":").map(Number);
      const updatedDate = dayjs(date)
        .hour(hours)
        .minute(minutes)
        .second(seconds)
        .toDate();
      setDate(updatedDate);
    }
  };

  const handleDateChange = (selectedDate: Date) => {
    const [hours, minutes, seconds] = time.split(":").map(Number);
    const updatedDate = dayjs(selectedDate)
      .hour(hours)
      .minute(minutes)
      .second(seconds)
      .toDate();
    setDate(updatedDate);
    setOpen(false);
  };

  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-3">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date-picker"
              className="w-32 justify-between font-normal"
            >
              {date ? dayjs(date).format("DD/MM/YYYY") : "Select date"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              required
              mode="single"
              selected={date}
              captionLayout="dropdown"
              onSelect={handleDateChange}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-col gap-3">
        <Input
          type="time"
          id="time-picker"
          step="1"
          value={time}
          onChange={handleTimeChange}
          className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </div>
    </div>
  );
}
