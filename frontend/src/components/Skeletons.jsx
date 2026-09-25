import React from 'react';

/**
 * Basic pulsing placeholder block
 */
export const SkeletonBox = ({ className = '' }) => (
  <div className={`animate-pulse bg-slate-200/80 dark:bg-white/10 rounded-xl ${className}`} />
);

/**
 * Product Card Skeleton (Supports Grid and List views)
 */
export const ProductCardSkeleton = ({ count = 8, viewMode = 'grid' }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        viewMode === 'list' ? (
          <div
            key={idx}
            className="bg-theme-card border border-theme-border rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-pulse"
          >
            <div className="flex items-center gap-4 flex-1 w-full">
              <div className="w-20 h-20 rounded-xl bg-slate-200 dark:bg-white/10 shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="w-24 h-3 rounded bg-slate-200 dark:bg-white/10" />
                <div className="w-3/4 h-4 rounded bg-slate-200 dark:bg-white/10" />
                <div className="w-1/2 h-3 rounded bg-slate-200 dark:bg-white/10" />
              </div>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end pt-2 sm:pt-0">
              <div className="w-20 h-5 rounded bg-slate-200 dark:bg-white/10" />
              <div className="w-20 h-8 rounded-xl bg-slate-200 dark:bg-white/10" />
            </div>
          </div>
        ) : (
          <div
            key={idx}
            className="bg-theme-card rounded-3xl border border-theme-border overflow-hidden shadow-2xs flex flex-col justify-between animate-pulse"
          >
            <div>
              {/* Product Image placeholder */}
              <div className="relative aspect-4/3 bg-slate-200 dark:bg-white/10 overflow-hidden">
                <div className="absolute top-3 left-3 w-16 h-4 rounded-md bg-slate-300 dark:bg-white/20" />
                <div className="absolute top-3 right-3 w-12 h-4 rounded-md bg-slate-300 dark:bg-white/20" />
              </div>

              {/* Product Info */}
              <div className="p-4 space-y-2.5">
                <div className="w-20 h-2.5 rounded bg-slate-200 dark:bg-white/10" />
                <div className="w-full h-4 rounded bg-slate-200 dark:bg-white/10" />
                <div className="w-3/4 h-3.5 rounded bg-slate-200 dark:bg-white/10" />
                
                {/* Rating row */}
                <div className="flex items-center gap-2 pt-1">
                  <div className="w-14 h-4 rounded-md bg-slate-200 dark:bg-white/10" />
                  <div className="w-20 h-3 rounded bg-slate-200 dark:bg-white/10" />
                </div>

                {/* Price block */}
                <div className="pt-2 flex items-baseline gap-2">
                  <div className="w-20 h-5 rounded bg-slate-200 dark:bg-white/10" />
                  <div className="w-14 h-3 rounded bg-slate-200 dark:bg-white/10" />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="p-4 pt-0 grid grid-cols-2 gap-2 mt-auto">
              <div className="h-9 rounded-xl bg-slate-200 dark:bg-white/10" />
              <div className="h-9 rounded-xl bg-slate-300 dark:bg-white/20" />
            </div>
          </div>
        )
      ))}
    </>
  );
};

/**
 * Metric / KPI Cards Skeleton (for Seller and Admin Dashboards)
 */
export const KPICardSkeleton = ({ count = 4 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-theme-card border border-theme-border rounded-3xl p-5 shadow-xs animate-pulse space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="w-28 h-3.5 rounded bg-slate-200 dark:bg-white/10" />
            <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-white/10" />
          </div>
          <div className="w-32 h-7 rounded-lg bg-slate-200 dark:bg-white/10" />
          <div className="pt-2 border-t border-theme-border flex items-center justify-between">
            <div className="w-24 h-2.5 rounded bg-slate-200 dark:bg-white/10" />
            <div className="w-16 h-2.5 rounded bg-slate-200 dark:bg-white/10" />
          </div>
        </div>
      ))}
    </>
  );
};

/**
 * Order Card Skeleton (for User Orders, Seller Orders, Admin Orders)
 */
export const OrderCardSkeleton = ({ count = 3 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-theme-card border border-theme-border rounded-3xl p-5 sm:p-6 shadow-xs animate-pulse space-y-4"
        >
          {/* Header row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-theme-border">
            <div className="flex items-center gap-3">
              <div className="w-28 h-5 rounded-lg bg-slate-200 dark:bg-white/10" />
              <div className="w-20 h-5 rounded-full bg-slate-200 dark:bg-white/10" />
              <div className="w-24 h-3.5 rounded bg-slate-200 dark:bg-white/10" />
            </div>
            <div className="w-28 h-6 rounded-lg bg-slate-200 dark:bg-white/10" />
          </div>

          {/* Item details */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-16 h-16 rounded-2xl bg-slate-200 dark:bg-white/10 shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="w-3/4 h-4 rounded bg-slate-200 dark:bg-white/10" />
                <div className="w-1/2 h-3 rounded bg-slate-200 dark:bg-white/10" />
                <div className="w-1/3 h-3 rounded bg-slate-200 dark:bg-white/10" />
              </div>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-center">
              <div className="w-24 h-8 rounded-xl bg-slate-200 dark:bg-white/10" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Table Rows Skeleton (for Spreadsheet tables in Admin/Seller)
 */
export const TableRowSkeleton = ({ rows = 5, cols = 5 }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, rIdx) => (
        <tr key={rIdx} className="border-b border-theme-border animate-pulse">
          {Array.from({ length: cols }).map((_, cIdx) => (
            <td key={cIdx} className="py-4 px-4">
              <div
                className={`h-4 rounded bg-slate-200 dark:bg-white/10 ${
                  cIdx === 0 ? 'w-40' : cIdx === cols - 1 ? 'w-16 ml-auto' : 'w-24'
                }`}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};

/**
 * Dossier Card Skeleton (for Admin Seller Approvals)
 */
export const DossierCardSkeleton = ({ count = 3 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-theme-card border border-theme-border rounded-3xl p-5 sm:p-6 shadow-xs animate-pulse space-y-5"
        >
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-theme-border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-white/10" />
              <div className="space-y-1.5">
                <div className="w-48 h-5 rounded-lg bg-slate-200 dark:bg-white/10" />
                <div className="w-32 h-3.5 rounded bg-slate-200 dark:bg-white/10" />
              </div>
            </div>
            <div className="w-24 h-6 rounded-full bg-slate-200 dark:bg-white/10" />
          </div>

          {/* 3 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3.5 rounded-2xl bg-theme-page space-y-2">
              <div className="w-24 h-3 rounded bg-slate-200 dark:bg-white/10" />
              <div className="w-36 h-4 rounded bg-slate-200 dark:bg-white/10" />
              <div className="w-28 h-3 rounded bg-slate-200 dark:bg-white/10" />
            </div>
            <div className="p-3.5 rounded-2xl bg-theme-page space-y-2">
              <div className="w-24 h-3 rounded bg-slate-200 dark:bg-white/10" />
              <div className="w-40 h-4 rounded bg-slate-200 dark:bg-white/10" />
              <div className="w-32 h-3 rounded bg-slate-200 dark:bg-white/10" />
            </div>
            <div className="p-3.5 rounded-2xl bg-theme-page space-y-2">
              <div className="w-24 h-3 rounded bg-slate-200 dark:bg-white/10" />
              <div className="w-32 h-4 rounded bg-slate-200 dark:bg-white/10" />
              <div className="w-24 h-3 rounded bg-slate-200 dark:bg-white/10" />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <div className="w-24 h-8 rounded-xl bg-slate-200 dark:bg-white/10" />
            <div className="w-28 h-8 rounded-xl bg-slate-300 dark:bg-white/20" />
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Profile Page Skeleton
 */
export const ProfileSkeleton = () => {
  return (
    <div className="bg-theme-card border border-theme-border rounded-3xl p-6 sm:p-8 shadow-xs animate-pulse space-y-6">
      <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-theme-border">
        <div className="w-24 h-24 rounded-full bg-slate-200 dark:bg-white/10" />
        <div className="space-y-2 text-center sm:text-left flex-1">
          <div className="w-48 h-6 rounded-lg bg-slate-200 dark:bg-white/10 mx-auto sm:mx-0" />
          <div className="w-36 h-3.5 rounded bg-slate-200 dark:bg-white/10 mx-auto sm:mx-0" />
          <div className="w-24 h-5 rounded-full bg-slate-200 dark:bg-white/10 mx-auto sm:mx-0" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="w-24 h-3 rounded bg-slate-200 dark:bg-white/10" />
            <div className="w-full h-10 rounded-xl bg-slate-200 dark:bg-white/10" />
          </div>
        ))}
      </div>
      <div className="w-32 h-10 rounded-xl bg-slate-200 dark:bg-white/10 ml-auto" />
    </div>
  );
};
