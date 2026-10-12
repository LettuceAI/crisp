import { useState } from "react";
import { Badge, Table } from "@lettuceai/crisp";

const rows = [
  { id: "1", model: "Gemma 3", tokens: 12400, status: "ok" },
  { id: "2", model: "Llama 3.2", tokens: 8200, status: "ok" },
  { id: "3", model: "GPT", tokens: 15100, status: "error" },
];

export default function TableExample() {
  const [sort, setSort] = useState<{ key: string; direction: "asc" | "desc" }>({ key: "tokens", direction: "desc" });
  const sorted = [...rows].sort((a, b) => (sort.key === "model" ? a.model.localeCompare(b.model) : a.tokens - b.tokens) * (sort.direction === "asc" ? 1 : -1));
  return (
    <div className="w-full max-w-lg">
      <Table
        caption="Usage by model"
        rows={sorted}
        rowKey={(row) => row.id}
        sort={sort}
        onSortChange={setSort}
        columns={[
          { key: "model", header: "Model", sortable: true, cell: (row) => row.model },
          { key: "tokens", header: "Tokens", sortable: true, numeric: true, cell: (row) => row.tokens.toLocaleString("en") },
          { key: "status", header: "Status", cell: (row) => <Badge tone={row.status === "ok" ? "accent" : "danger"}>{row.status}</Badge> },
        ]}
      />
    </div>
  );
}
