import { useState } from "react";
import { Pagination } from "@lettuceai/crisp";

export default function PaginationExample() {
  const [page, setPage] = useState(5);
  return <Pagination page={page} pageCount={20} onChange={setPage} />;
}
