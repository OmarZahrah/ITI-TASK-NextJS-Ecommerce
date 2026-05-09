"use client";

const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: "new", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating", label: "Highest rated" },
];

export function SortDropdown({
  current,
  hidden,
}: {
  current: string;
  hidden: { name: string; value: string }[];
}) {
  return (
    <form className="flex items-center gap-2">
      {hidden.map((field) => (
        <input key={field.name} type="hidden" name={field.name} value={field.value} />
      ))}
      <label className="text-xs uppercase tracking-wider text-slate-500" htmlFor="sort">
        Sort
      </label>
      <select
        id="sort"
        name="sort"
        defaultValue={current}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm focus:border-slate-400 focus:outline-none"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </form>
  );
}
