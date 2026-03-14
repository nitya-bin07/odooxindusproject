import { useState, useEffect } from "react";
import api from "../api";

const TYPES = ["All", "receipt", "delivery", "transfer_in", "transfer_out", "adjustment"];

export default function MoveHistory() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [movementType, setMovementType] = useState("All");

  const fetchLedger = () => {
    setLoading(true);
    const params = { page, limit: 25 };
    if (movementType !== "All") params.movementType = movementType;
    api.get("/ledger", { params })
      .then((res) => {
        setEntries(res.data.data.ledger || []);
        setTotal(res.data.data.pagination?.total || 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchLedger(); }, [page, movementType]);

  const typeColors = {
    receipt: "bg-green-900/40 text-green-400", delivery: "bg-red-900/40 text-red-400",
    transfer_in: "bg-blue-900/40 text-blue-400", transfer_out: "bg-purple-900/40 text-purple-400",
    adjustment: "bg-yellow-900/40 text-yellow-400",
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Move History</h1>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        {TYPES.map((t) => (
          <button key={t} onClick={() => { setMovementType(t); setPage(1); }}
            className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${
              movementType === t ? "bg-red-600 text-white" : "bg-[#1e293b] text-gray-400 hover:text-gray-200 border border-gray-800"
            }`}>
            {t === "All" ? "All" : t.replace("_", " ")}
          </button>
        ))}
      </div>

      {loading ? <p className="text-gray-400">Loading…</p> : (
        <div className="bg-[#1e293b] rounded-xl border border-gray-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#0f172a] text-gray-400 text-xs uppercase">
              <tr>
                <th className="text-left px-5 py-3">Date</th>
                <th className="text-left px-5 py-3">Type</th>
                <th className="text-left px-5 py-3">Product</th>
                <th className="text-left px-5 py-3">Location</th>
                <th className="text-right px-5 py-3">Qty</th>
                <th className="text-right px-5 py-3">Balance</th>
                <th className="text-left px-5 py-3">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {entries.map((e) => (
                <tr key={e.id} className="text-gray-300 hover:bg-white/5">
                  <td className="px-5 py-3 text-gray-500 text-xs">{new Date(e.createdAt).toLocaleString()}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[e.movementType] || "bg-gray-700 text-gray-300"}`}>
                      {e.movementType?.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-5 py-3">{e.product?.name || "—"}</td>
                  <td className="px-5 py-3">{e.location?.name || "—"}</td>
                  <td className={`px-5 py-3 text-right font-mono ${parseFloat(e.qty) >= 0 ? "text-green-400" : "text-red-400"}`}>
                    {parseFloat(e.qty) >= 0 ? "+" : ""}{e.qty}
                  </td>
                  <td className="px-5 py-3 text-right font-mono">{e.balanceAfter}</td>
                  <td className="px-5 py-3 text-gray-500 text-xs truncate max-w-[200px]">{e.notes || "—"}</td>
                </tr>
              ))}
              {entries.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-8 text-center text-gray-500">No movements found</td></tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {total > 25 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-gray-800">
              <p className="text-xs text-gray-500">{total} total entries</p>
              <div className="flex gap-2">
                <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
                  className="px-3 py-1 text-xs bg-gray-700 text-gray-300 rounded disabled:opacity-30">Prev</button>
                <span className="px-3 py-1 text-xs text-gray-400">Page {page}</span>
                <button disabled={page * 25 >= total} onClick={() => setPage(p => p + 1)}
                  className="px-3 py-1 text-xs bg-gray-700 text-gray-300 rounded disabled:opacity-30">Next</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
