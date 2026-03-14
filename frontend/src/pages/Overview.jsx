import { useState, useEffect } from "react";
import api from "../api";

export default function Overview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/dashboard")
      .then((res) => setData(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-gray-400">Loading dashboard…</p>;
  if (!data) return <p className="text-red-400">Failed to load dashboard data.</p>;

  const { kpis, lowStockProducts } = data;

  const cards = [
    { label: "Total Products",       value: kpis.totalProducts,            color: "bg-blue-600" },
    { label: "Low Stock",            value: kpis.lowStockItems,            color: "bg-yellow-600" },
    { label: "Out of Stock",         value: kpis.outOfStockItems,          color: "bg-red-600" },
    { label: "Pending Receipts",     value: kpis.pendingReceipts,          color: "bg-green-600" },
    { label: "Pending Deliveries",   value: kpis.pendingDeliveries,        color: "bg-purple-600" },
    { label: "Scheduled Transfers",  value: kpis.scheduledTransfers,       color: "bg-cyan-600" },
    { label: "Draft Adjustments",    value: kpis.draftAdjustments,         color: "bg-orange-600" },
    { label: "Receipts (7 days)",    value: kpis.recentReceiptsLast7Days,  color: "bg-emerald-600" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Dashboard Overview</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {cards.map((c) => (
          <div key={c.label} className="bg-[#1e293b] rounded-xl p-5 border border-gray-800">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">{c.label}</p>
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${c.color}`} />
              <p className="text-2xl font-bold text-white">{c.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Low Stock Table */}
      {lowStockProducts?.length > 0 && (
        <div className="bg-[#1e293b] rounded-xl border border-gray-800 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-800">
            <h2 className="text-sm font-semibold text-white">Low / Out of Stock Products</h2>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-[#0f172a] text-gray-400 text-xs uppercase">
              <tr>
                <th className="text-left px-5 py-3">Product</th>
                <th className="text-left px-5 py-3">SKU</th>
                <th className="text-right px-5 py-3">Qty</th>
                <th className="text-right px-5 py-3">Reorder Point</th>
                <th className="text-center px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {lowStockProducts.map((p) => (
                <tr key={p.productId} className="text-gray-300 hover:bg-white/5">
                  <td className="px-5 py-3">{p.productName}</td>
                  <td className="px-5 py-3 text-gray-500">{p.sku}</td>
                  <td className="px-5 py-3 text-right font-mono">{p.totalQty}</td>
                  <td className="px-5 py-3 text-right font-mono">{p.reorderPoint}</td>
                  <td className="px-5 py-3 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      p.isOutOfStock ? "bg-red-900/40 text-red-400" : "bg-yellow-900/40 text-yellow-400"
                    }`}>
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
