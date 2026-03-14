import { useState, useEffect } from "react";
import api from "../api";
import {
  Package,
  AlertTriangle,
  XCircle,
  Truck,
  ArrowRightLeft,
  ClipboardList,
  BarChart3
} from "lucide-react";

export default function Overview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/dashboard")
      .then((res) => setData(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="text-gray-400 text-sm animate-pulse">
        Loading dashboard...
      </div>
    );

  if (!data)
    return (
      <div className="text-red-400 text-sm">
        Failed to load dashboard data.
      </div>
    );

  const { kpis, lowStockProducts } = data;

  const cards = [
    {
      label: "Total Products",
      value: kpis.totalProducts,
      icon: Package,
      color: "text-blue-400"
    },
    {
      label: "Low Stock",
      value: kpis.lowStockItems,
      icon: AlertTriangle,
      color: "text-yellow-400"
    },
    {
      label: "Out of Stock",
      value: kpis.outOfStockItems,
      icon: XCircle,
      color: "text-red-400"
    },
    {
      label: "Pending Receipts",
      value: kpis.pendingReceipts,
      icon: Truck,
      color: "text-green-400"
    },
    {
      label: "Pending Deliveries",
      value: kpis.pendingDeliveries,
      icon: Truck,
      color: "text-purple-400"
    },
    {
      label: "Scheduled Transfers",
      value: kpis.scheduledTransfers,
      icon: ArrowRightLeft,
      color: "text-cyan-400"
    },
    {
      label: "Draft Adjustments",
      value: kpis.draftAdjustments,
      icon: ClipboardList,
      color: "text-orange-400"
    },
    {
      label: "Receipts (7 days)",
      value: kpis.recentReceiptsLast7Days,
      icon: BarChart3,
      color: "text-emerald-400"
    }
  ];

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          Inventory Dashboard
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Overview of inventory activity and stock health
        </p>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {cards.map((c) => {
          const Icon = c.icon;

          return (
            <div
              key={c.label}
              className="bg-[#1e293b] rounded-xl p-5 border border-gray-800 hover:border-gray-700 transition-all hover:shadow-lg hover:shadow-black/20"
            >
              <div className="flex items-center justify-between mb-3">

                <div className="text-gray-400 text-xs uppercase tracking-wide">
                  {c.label}
                </div>

                <Icon className={`${c.color}`} size={18} />

              </div>

              <div className="text-3xl font-bold text-white">
                {c.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* LOW STOCK SECTION */}
      {lowStockProducts?.length > 0 && (
        <div className="bg-[#1e293b] rounded-xl border border-gray-800 overflow-hidden">

          {/* Section header */}
          <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">
              Low / Out of Stock Products
            </h2>

            <span className="text-xs text-gray-400">
              {lowStockProducts.length} items
            </span>
          </div>

          {/* Table */}
          <table className="w-full text-sm">

            <thead className="bg-[#0f172a] text-gray-400 text-xs uppercase">
              <tr>
                <th className="text-left px-6 py-3">Product</th>
                <th className="text-left px-6 py-3">SKU</th>
                <th className="text-right px-6 py-3">Quantity</th>
                <th className="text-right px-6 py-3">Reorder Point</th>
                <th className="text-center px-6 py-3">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-800">

              {lowStockProducts.map((p) => (
                <tr
                  key={p.productId}
                  className="text-gray-300 hover:bg-white/5 transition"
                >

                  <td className="px-6 py-4 font-medium text-white">
                    {p.productName}
                  </td>

                  <td className="px-6 py-4 text-gray-500 font-mono">
                    {p.sku}
                  </td>

                  <td className="px-6 py-4 text-right font-mono">
                    {p.totalQty}
                  </td>

                  <td className="px-6 py-4 text-right font-mono">
                    {p.reorderPoint}
                  </td>

                  <td className="px-6 py-4 text-center">

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium
                        ${
                          p.isOutOfStock
                            ? "bg-red-900/40 text-red-400 border border-red-800"
                            : "bg-yellow-900/40 text-yellow-400 border border-yellow-800"
                        }`}
                    >
                      {p.isOutOfStock ? "Out of Stock" : "Low Stock"}
                    </span>

                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>
      )}

    </div>
  );
}