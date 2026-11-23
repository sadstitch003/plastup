"use client";

export const PAGE_SIZE = 5;

export function pageOf<T>(rows: T[], page: number) {
  const pages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const current = Math.min(Math.max(page, 1), pages);
  const start = (current - 1) * PAGE_SIZE;
  return { pages, current, rows: rows.slice(start, start + PAGE_SIZE) };
}

export function AdminPager({ page, pages, onPage }: { page: number; pages: number; onPage: (page: number) => void }) {
  return (
    <div className="admin-pager">
      <button type="button" disabled={page <= 1} onClick={() => onPage(page - 1)}>
        Sebelumnya
      </button>
      <span>
        {page} / {pages}
      </span>
      <button type="button" disabled={page >= pages} onClick={() => onPage(page + 1)}>
        Berikutnya
      </button>
    </div>
  );
}