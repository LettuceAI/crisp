import { useState } from "react";
import { DatePicker } from "@lettuceai/crisp";

export default function DatePickerExample() {
  const [date, setDate] = useState<Date | null>(null);
  return (
    <div className="w-full max-w-xs">
      <DatePicker value={date} onChange={setDate} placeholder="Pick a date" withTime />
    </div>
  );
}
