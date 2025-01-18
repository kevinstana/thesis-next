export default function Pagination({
  size,
  number,
  totalElements,
  totalPages,
}: {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}) {
  return (
    <div className="px-4 py-3 flex flex-wrap items-center justify-between border-t border-dark-border">
      <div className="text-sm text-dark-text-secondary">
        Showing {1 + size * number} to {size * (number + 1)} of {totalElements}{" "}
        results
      </div>
      <div className="flex items-center space-x-2">
        <button
          className="px-3 py-1 rounded border border-dark-border hover:bg-dark-bg-tertiary disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          onClick={() => {}}
          disabled={number === 0}
        >
          Previous
        </button>
        <span className="text-sm text-dark-text-secondary">
          Page {number + 1} of {totalPages}
        </span>
        <button
          className="px-3 py-1 rounded border border-dark-border hover:bg-dark-bg-tertiary disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          onClick={() => {}}
          disabled={number === totalPages - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
}
