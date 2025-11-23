import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export function PaginationComponent({ page, setPage, totalPages }: any) {
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

        {/* Page Numbers */}
        {[...Array(totalPages)].map((_, index) => {
          const pageNum = index + 1;
          return (
            <PaginationItem key={pageNum}>
              <PaginationLink
                href="#"
                isActive={page === pageNum}
                onClick={(e) => {
                  e.preventDefault();
                  setPage(pageNum);
                }}
              >
                {pageNum}
              </PaginationLink>
            </PaginationItem>
          );
        })}

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
