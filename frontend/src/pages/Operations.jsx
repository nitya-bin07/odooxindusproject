import { useState, useEffect } from "react";
import api from "../api";
import { toast } from "react-toastify";

const TABS = ["Receipts", "Deliveries", "Transfers", "Adjustments"];

const ENDPOINTS = {
  Receipts: "receipts",
  Deliveries: "deliveries",
  Transfers: "transfers",
  Adjustments: "adjustments",
};

function StatusBadge({ status }) {

  const colors = {
    draft: "bg-gray-700 text-gray-300",
    waiting: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
    ready: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    done: "bg-green-500/10 text-green-400 border border-green-500/20",
    canceled: "bg-red-500/10 text-red-400 border border-red-500/20",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        colors[status] || "bg-gray-700 text-gray-300"
      }`}
    >
      {status}
    </span>
  );
}

export default function Operations() {

  const [tab, setTab] = useState("Receipts");

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);
  const [locations, setLocations] = useState([]);

  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({});
  const [lines, setLines] = useState([]);

  useEffect(() => {

    api.get("/warehouses").then(r => setWarehouses(r.data.data.warehouses || []));
    api.get("/products").then(r => setProducts(r.data.data.products || []));
    api.get("/locations").then(r => setLocations(r.data.data.locations || []));

  }, []);


  const fetchItems = () => {

    setLoading(true);

    api.get(`/${ENDPOINTS[tab]}`)
      .then(r => {

        const key = ENDPOINTS[tab];
        setItems(r.data.data[key] || []);

      })
      .catch(() => toast.error(`Failed to load ${tab}`))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchItems();
    setShowForm(false);
  }, [tab]);


  const handleValidate = async (id) => {

    if (!confirm("Validate this document?")) return;

    try {

      await api.post(`/${ENDPOINTS[tab]}/${id}/validate`);

      toast.success("Document validated");

      fetchItems();

    } catch (err) {

      toast.error(err.response?.data?.message || "Validation failed");

    }

  };


  const handleCancel = async (id) => {

    if (!confirm("Cancel this document?")) return;

    try {

      await api.post(`/${ENDPOINTS[tab]}/${id}/cancel`);

      toast.success("Document canceled");

      fetchItems();

    } catch (err) {

      toast.error(err.response?.data?.message || "Cancel failed");

    }

  };


  const openForm = () => {

    setLines([]);
    setForm({});
    setShowForm(true);

  };


  const addLine = () => {

    setLines([
      ...lines,
      {
        productId: "",
        locationId: "",
        qty: "",
      },
    ]);

  };


  const updateLine = (i, key, val) => {

    const copy = [...lines];

    copy[i][key] = val;

    setLines(copy);

  };


  const removeLine = (i) => {

    setLines(lines.filter((_, idx) => idx !== i));

  };


  const handleCreate = async () => {

    try {

      await api.post(`/${ENDPOINTS[tab]}`, {
        ...form,
        lines,
      });

      toast.success(`${tab.slice(0, -1)} created`);

      setShowForm(false);

      fetchItems();

    } catch (err) {

      toast.error(err.response?.data?.message || "Create failed");

    }

  };


  /* KPI COUNTS */

  const drafts = items.filter(i => i.status === "draft").length;
  const completed = items.filter(i => i.status === "done").length;
  const waiting = items.filter(i => i.status === "waiting").length;


  return (

    <div className="space-y-8">

      {/* HEADER */}

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-2xl font-semibold text-white">
            Inventory Operations
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Manage receipts, deliveries, transfers and stock adjustments
          </p>

        </div>

        <button
          onClick={openForm}
          className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-medium rounded-lg shadow transition"
        >
          + Create {tab.slice(0, -1)}
        </button>

      </div>


      {/* TABS */}

      <div className="flex gap-2">

        {TABS.map(t => (

          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 text-sm font-semibold rounded-full transition-all
            ${
              tab === t
                ? "bg-red-600 text-white shadow-lg"
                : "bg-[#1e293b] border border-gray-800 text-gray-400 hover:text-gray-200"
            }`}
          >
            {t.toUpperCase()}
          </button>

        ))}

      </div>


      {/* KPI CARDS */}

      <div className="grid grid-cols-3 gap-5">

        <div className="bg-[#1e293b] border border-gray-800 rounded-xl p-5">
          <p className="text-xs text-gray-500 uppercase">Draft</p>
          <p className="text-2xl font-semibold text-white">{drafts}</p>
        </div>

        <div className="bg-[#1e293b] border border-gray-800 rounded-xl p-5">
          <p className="text-xs text-gray-500 uppercase">Waiting</p>
          <p className="text-2xl font-semibold text-yellow-400">{waiting}</p>
        </div>

        <div className="bg-[#1e293b] border border-gray-800 rounded-xl p-5">
          <p className="text-xs text-gray-500 uppercase">Completed</p>
          <p className="text-2xl font-semibold text-green-400">{completed}</p>
        </div>

      </div>


      {/* TABLE */}

      <div className="bg-[#1e293b] border border-gray-800 rounded-xl overflow-hidden shadow-lg">

        {loading ? (

          <p className="text-gray-400 p-6">Loading...</p>

        ) : (

          <table className="w-full text-sm">

            <thead className="bg-[#0f172a] text-gray-400 text-xs uppercase">

              <tr>

                <th className="text-left px-6 py-3">Reference</th>
                <th className="text-left px-6 py-3">
                  {tab === "Transfers" ? "Route" : "Warehouse"}
                </th>
                <th className="text-center px-6 py-3">Lines</th>
                <th className="text-center px-6 py-3">Status</th>
                <th className="text-left px-6 py-3">Date</th>
                <th className="text-right px-6 py-3">Actions</th>

              </tr>

            </thead>

            <tbody className="divide-y divide-gray-800">

              {items.map(item => (

                <tr
                  key={item.id}
                  className="hover:bg-white/5 transition"
                >

                  <td className="px-6 py-3 font-mono text-xs text-gray-300">
                    {item.reference}
                  </td>

                  <td className="px-6 py-3 text-gray-300">
                    {tab === "Transfers"
                      ? `${item.fromWarehouseId?.substring(0, 6)} → ${item.toWarehouseId?.substring(0, 6)}`
                      : item.warehouse?.name || "—"}
                  </td>

                  <td className="px-6 py-3 text-center">
                    {item.lines?.length || 0}
                  </td>

                  <td className="px-6 py-3 text-center">
                    <StatusBadge status={item.status} />
                  </td>

                  <td className="px-6 py-3 text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-3 text-right space-x-3">

                    {item.status !== "done" &&
                      item.status !== "canceled" && (
                        <>
                          <button
                            onClick={() => handleValidate(item.id)}
                            className="text-green-400 hover:text-green-300 text-xs"
                          >
                            Validate
                          </button>

                          <button
                            onClick={() => handleCancel(item.id)}
                            className="text-red-400 hover:text-red-300 text-xs"
                          >
                            Cancel
                          </button>
                        </>
                      )}

                  </td>

                </tr>

              ))}

              {items.length === 0 && (

                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-10 text-gray-500"
                  >
                    No {tab.toLowerCase()} found
                  </td>
                </tr>

              )}

            </tbody>

          </table>

        )}

      </div>

    </div>
  );
}