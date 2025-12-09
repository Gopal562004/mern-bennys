import React from "react";

const TableSkeleton = () => {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="px-4 py-3 text-left w-12">
                <div className="skeleton w-4 h-4 rounded" />
              </th>
              <th className="px-4 py-3 text-left">
                <div className="skeleton w-24 h-4 rounded" />
              </th>
              <th className="px-4 py-3 text-left">
                <div className="skeleton w-16 h-4 rounded" />
              </th>
              <th className="px-4 py-3 text-left">
                <div className="skeleton w-24 h-4 rounded" />
              </th>
              <th className="px-4 py-3 text-left">
                <div className="skeleton w-20 h-4 rounded" />
              </th>
              <th className="px-4 py-3 text-left">
                <div className="skeleton w-16 h-4 rounded" />
              </th>
            </tr>
          </thead>
          <tbody>
            {[...Array(5)]?.map((_, index) => (
              <tr key={index} className="border-b border-border">
                <td className="px-4 py-3">
                  <div className="skeleton w-4 h-4 rounded" />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="skeleton w-12 h-16 rounded" />
                    <div className="flex-1">
                      <div className="skeleton w-32 h-4 rounded mb-2" />
                      <div className="skeleton w-20 h-3 rounded" />
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="skeleton w-12 h-4 rounded" />
                </td>
                <td className="px-4 py-3">
                  <div className="skeleton w-24 h-4 rounded" />
                </td>
                <td className="px-4 py-3">
                  <div className="skeleton w-16 h-4 rounded" />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="skeleton w-8 h-8 rounded" />
                    <div className="skeleton w-8 h-8 rounded" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableSkeleton;
