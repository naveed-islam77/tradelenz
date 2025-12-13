import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export function PaginationComponent({ page, setPage, totalPages }: any) {
  const pages = getPaginationRange(page, totalPages);

  return (
    <Pagination>
      <PaginationContent>
        {/* Previous */}
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (page > 1) setPage(page - 1);
            }}
            className={page === 1 ? "opacity-50 pointer-events-none" : ""}
          />
        </PaginationItem>

        {/* Page Numbers + Dots */}
        {pages.map((p, index) => (
          <PaginationItem key={`${p}-${index}`}>
            {p === "..." ? (
              <span className="px-3 py-2 text-muted-foreground">...</span>
            ) : (
              <PaginationLink
                href="#"
                isActive={page === p}
                onClick={(e) => {
                  e.preventDefault();
                  setPage(p);
                }}
              >
                {p}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        {/* Next */}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (page < totalPages) setPage(page + 1);
            }}
            className={
              page === totalPages ? "opacity-50 pointer-events-none" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

function getPaginationRange(current: number, total: number) {
  const delta = 2;
  const range: (number | "...")[] = [];

  const left = Math.max(2, current - delta);
  const right = Math.min(total - 1, current + delta);

  range.push(1);

  if (left > 2) {
    range.push("...");
  }

  for (let i = left; i <= right; i++) {
    range.push(i);
  }

  if (right < total - 1) {
    range.push("...");
  }

  if (total > 1) {
    range.push(total);
  }

  return range;
}
