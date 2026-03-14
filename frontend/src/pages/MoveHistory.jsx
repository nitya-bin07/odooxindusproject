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

    if (movementType !== "All") {
      params.movementType = movementType;
    }

    api.get("/ledger", { params })
      .then((res) => {

        setEntries(res.data.data.ledger || []);
        setTotal(res.data.data.pagination?.total || 0);

      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLedger();
  }, [page, movementType]);


  /* KPI COUNTS */

  const receipts = entries.filter(e => e.movementType === "receipt").length;
  const deliveries = entries.filter(e => e.movementType === "delivery").length;


  /* BADGE COLORS */

  const typeColors = {
    receipt: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    delivery: "bg-red-500/10 text-red-400 border border-red-500/20",
    transfer_in: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    transfer_out: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
    adjustment: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
  };


  return (

    <div className="space-y-8">

      {/* PAGE HEADER */}

      <div>

        <h1 className="text-2xl font-semibold text-white">
          Inventory Movement
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Track stock receipts, deliveries and transfers
        </p>

      </div>


      {/* FILTER TABS */}

      <div className="flex flex-wrap gap-3">

        {TYPES.map((t) => (

          <button
            key={t}
            onClick={() => {
              setMovementType(t);
              setPage(1);
            }}
            className={`px-4 py-2 text-xs rounded-full font-semibold transition-all
            ${
              movementType === t
                ? "bg-red-600 text-white shadow-lg"
                : "bg-[#1e293b] text-gray-400 border border-gray-800 hover:text-gray-200"
            }`}
          >
            {t === "All" ? "ALL" : t.replace("_", " ").toUpperCase()}
          </button>

        ))}

      </div>


      {/* KPI CARDS */}

      <div className="grid grid-cols-3 gap-5">

        {/* TOTAL */}

        <div className="bg-[#1e293b] border border-gray-800 rounded-xl p-5">

          <p className="text-xs text-gray-500 uppercase">
            Total Movements
          </p>

          <p className="text-2xl text-white font-semibold mt-1">
            {total}
          </p>

        </div>


        {/* RECEIPTS */}

        <div className="bg-[#1e293b] border border-gray-800 rounded-xl p-5">

          <p className="text-xs text-gray-500 uppercase">
            Receipts
          </p>

          <p className="text-2xl text-emerald-400 font-semibold mt-1">
            {receipts}
          </p>

        </div>


        {/* DELIVERIES */}

        <div className="bg-[#1e293b] border border-gray-800 rounded-xl p-5">

          <p className="text-xs text-gray-500 uppercase">
            Deliveries
          </p>

          <p className="text-2xl text-red-400 font-semibold mt-1">
            {deliveries}
          </p>

        </div>

      </div>


      {/* TABLE */}

      <div className="bg-[#1e293b] border border-gray-800 rounded-xl overflow-hidden shadow-lg">

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead className="bg-[#0f172a] text-gray-400 text-xs uppercase">

              <tr>

                <th className="text-left px-6 py-3">Date</th>
                <th className="text-left px-6 py-3">Type</th>
                <th className="text-left px-6 py-3">Product</th>
                <th className="text-left px-6 py-3">Location</th>
                <th className="text-right px-6 py-3">Qty</th>
                <th className="text-right px-6 py-3">Balance</th>
                <th className="text-left px-6 py-3">Notes</th>

              </tr>

            </thead>


            <tbody className="divide-y divide-gray-800">

              {loading && (

                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-gray-400">
                    Loading movements...
                  </td>
                </tr>

              )}


              {!loading && entries.map((e) => (

                <tr
                  key={e.id}
                  className="text-gray-300 hover:bg-white/5 transition-colors"
                >

                  <td className="px-6 py-3 text-gray-500 text-xs">
                    {new Date(e.createdAt).toLocaleString()}
                  </td>


                  <td className="px-6 py-3">

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                        typeColors[e.movementType] ||
                        "bg-gray-700 text-gray-300"
                      }`}
                    >
                      {e.movementType?.replace("_", " ")}
                    </span>

                  </td>


                  <td className="px-6 py-3 font-medium">
                    {e.product?.name || "—"}
                  </td>


                  <td className="px-6 py-3 text-gray-400">
                    {e.location?.name || "—"}
                  </td>


                  <td
                    className={`px-6 py-3 text-right font-mono font-semibold ${
                      parseFloat(e.qty) >= 0
                        ? "text-emerald-400"
                        : "text-red-400"
                    }`}
                  >
                    {parseFloat(e.qty) >= 0 ? "+" : ""}
                    {e.qty}
                  </td>


                  <td className="px-6 py-3 text-right font-mono text-gray-300">
                    {e.balanceAfter}
                  </td>


                  <td className="px-6 py-3 text-gray-500 text-xs max-w-[220px] truncate">
                    {e.notes || "—"}
                  </td>

                </tr>

              ))}


              {!loading && entries.length === 0 && (

                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No movement history found
                  </td>
                </tr>

              )}

            </tbody>

          </table>

        </div>


        {/* PAGINATION */}

        {total > 25 && (

          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-800">

            <p className="text-xs text-gray-500">
              {total} total movements
            </p>

            <div className="flex items-center gap-3">

              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-4 py-1.5 text-xs bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 disabled:opacity-30"
              >
                Previous
              </button>

              <span className="text-xs text-gray-400">
                Page {page}
              </span>

              <button
                disabled={page * 25 >= total}
                onClick={() => setPage((p) => p + 1)}
                className="px-4 py-1.5 text-xs bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 disabled:opacity-30"
              >
                Next
              </button>

            </div>

          </div>

        )}

      </div>

    </div>
  );
}