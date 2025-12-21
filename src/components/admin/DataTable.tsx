import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronUp, ChevronDown } from "lucide-react";
import { useState, useMemo, ReactNode } from "react";

interface Column<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (item: T, index: number) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyField: keyof T;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchFields?: (keyof T)[];
  onRowClick?: (item: T) => void;
  actions?: (item: T) => ReactNode;
  emptyMessage?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  keyField,
  searchable = true,
  searchPlaceholder = "Hledat...",
  searchFields,
  onRowClick,
  actions,
  emptyMessage = "Žádná data k zobrazení",
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Filter and sort data
  const processedData = useMemo(() => {
    let result = [...data];

    // Filter
    if (search && searchFields) {
      const searchLower = search.toLowerCase();
      result = result.filter((item) =>
        searchFields.some((field) => {
          const value = item[field];
          return String(value).toLowerCase().includes(searchLower);
        }),
      );
    }

    // Sort
    if (sortKey) {
      result.sort((a, b) => {
        const aVal = a[sortKey as keyof T];
        const bVal = b[sortKey as keyof T];

        if (aVal === bVal) return 0;
        if (aVal === null || aVal === undefined) return 1;
        if (bVal === null || bVal === undefined) return -1;

        const comparison = String(aVal).localeCompare(String(bVal));
        return sortDirection === "asc" ? comparison : -comparison;
      });
    }

    return result;
  }, [data, search, searchFields, sortKey, sortDirection]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      {searchable && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#12121a] border border-white/10 text-white placeholder-gray-500 focus:border-cyan-500/50 focus:outline-none transition-colors"
          />
        </motion.div>
      )}

      {/* Table */}
      <div className="rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Header */}
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                {columns.map((column) => (
                  <th
                    key={String(column.key)}
                    onClick={
                      column.sortable
                        ? () => handleSort(String(column.key))
                        : undefined
                    }
                    className={`px-4 py-3 text-left text-sm font-medium text-gray-400 ${
                      column.sortable
                        ? "cursor-pointer hover:text-white transition-colors"
                        : ""
                    } ${column.className || ""}`}
                  >
                    <span className="flex items-center gap-2">
                      {column.label}
                      {column.sortable && sortKey === column.key && (
                        <motion.span
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                        >
                          {sortDirection === "asc" ? (
                            <ChevronUp className="w-4 h-4 text-cyan-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-cyan-400" />
                          )}
                        </motion.span>
                      )}
                    </span>
                  </th>
                ))}
                {actions && (
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-400 w-20">
                    Akce
                  </th>
                )}
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              <AnimatePresence mode="popLayout">
                {processedData.length === 0 ? (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td
                      colSpan={columns.length + (actions ? 1 : 0)}
                      className="px-4 py-12 text-center text-gray-500"
                    >
                      {emptyMessage}
                    </td>
                  </motion.tr>
                ) : (
                  processedData.map((item, index) => (
                    <motion.tr
                      key={String(item[keyField])}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{
                        backgroundColor: "rgba(6, 182, 212, 0.05)",
                      }}
                      onClick={onRowClick ? () => onRowClick(item) : undefined}
                      className={`border-b border-white/5 last:border-0 ${
                        onRowClick ? "cursor-pointer" : ""
                      }`}
                    >
                      {columns.map((column) => (
                        <td
                          key={String(column.key)}
                          className={`px-4 py-4 text-sm ${column.className || ""}`}
                        >
                          {column.render
                            ? column.render(item, index)
                            : (item[column.key as keyof T] as ReactNode)}
                        </td>
                      ))}
                      {actions && (
                        <td className="px-4 py-4 text-right">
                          {actions(item)}
                        </td>
                      )}
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Result count */}
      {search && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-gray-500"
        >
          Nalezeno: {processedData.length} z {data.length}
        </motion.p>
      )}
    </div>
  );
}
