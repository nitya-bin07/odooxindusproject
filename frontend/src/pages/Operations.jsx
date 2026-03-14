import { useState, useEffect } from "react";
import api from "../api";
import { toast } from "react-toastify";

const TABS = ["Receipts", "Deliveries", "Transfers", "Adjustments"];
const ENDPOINTS = { Receipts: "receipts", Deliveries: "deliveries", Transfers: "transfers", Adjustments: "adjustments" };

function StatusBadge({ status }) {
  const colors = {
    draft: "bg-gray-700 text-gray-300", waiting: "bg-yellow-900/40 text-yellow-400",
    ready: "bg-blue-900/40 text-blue-400", done: "bg-green-900/40 text-green-400",
    canceled: "bg-red-900/40 text-red-400",
  };
  return <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || "bg-gray-700 text-gray-300"}`}>{status}</span>;
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
    api.get("/warehouses").then(r => setWarehouses(r.data.data.warehouses || [])).catch(() => {});
    api.get("/products").then(r => setProducts(r.data.data.products || [])).catch(() => {});
    api.get("/locations").then(r => setLocations(r.data.data.locations || [])).catch(() => {});
  }, []);

  const fetchItems = () => {
    setLoading(true);
    api.get(`/${ENDPOINTS[tab]}`).then(r => {
      const key = ENDPOINTS[tab];
      setItems(r.data.data[key] || []);
    }).catch(() => toast.error(`Failed to load ${tab.toLowerCase()}`)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchItems(); setShowForm(false); }, [tab]);

  const handleValidate = async (id) => {
    if (!confirm("Validate this document? Stock will be updated.")) return;
    try {
      await api.post(`/${ENDPOINTS[tab]}/${id}/validate`);
      toast.success(`${tab.slice(0, -1)} validated successfully`);
      fetchItems();
    } catch (err) { toast.error(err.response?.data?.message || "Validation failed"); }
  };

  const handleCancel = async (id) => {
    if (!confirm("Cancel this document?")) return;
    try {
      await api.post(`/${ENDPOINTS[tab]}/${id}/cancel`);
      toast.success(`${tab.slice(0, -1)} canceled`);
      fetchItems();
    } catch (err) { toast.error(err.response?.data?.message || "Cancel failed"); }
  };

  const addLine = () => {
    if (tab === "Transfers") setLines([...lines, { productId: "", fromLocationId: "", toLocationId: "", qty: "" }]);
    else if (tab === "Adjustments") setLines([...lines, { productId: "", locationId: "", countedQty: "" }]);
    else if (tab === "Receipts") setLines([...lines, { productId: "", locationId: "", expectedQty: "" }]);
    else setLines([...lines, { productId: "", locationId: "", demandQty: "" }]);
  };

  const updateLine = (i, key, val) => { const l = [...lines]; l[i][key] = val; setLines(l); };
  const removeLine = (i) => { setLines(lines.filter((_, idx) => idx !== i)); };

  const handleCreate = async () => {
    try {
      const body = { ...form, lines };
      await api.post(`/${ENDPOINTS[tab]}`, body);
      toast.success(`${tab.slice(0, -1)} created`);
      setShowForm(false); setForm({}); setLines([]);
      fetchItems();
    } catch (err) { toast.error(err.response?.data?.message || "Create failed"); }
  };

  const openForm = () => { setForm({}); setLines([]); setShowForm(true); };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Operations</h1>
        <button onClick={openForm}
          className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-medium rounded-lg transition-all">
          + Create {tab.slice(0, -1)}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-[#1e293b] rounded-lg p-1 border border-gray-800">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
              tab === t ? "bg-red-600 text-white" : "text-gray-400 hover:text-gray-200"
            }`}>{t}</button>
        ))}
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="bg-[#1e293b] border border-gray-700 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">New {tab.slice(0, -1)}</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            {tab === "Transfers" ? (
              <>
                <select value={form.fromWarehouseId || ""} onChange={e => setForm({ ...form, fromWarehouseId: e.target.value })}
                  className="bg-[#0f172a] text-gray-200 text-sm rounded-lg px-4 py-2.5 border border-gray-700 outline-none">
                  <option value="">Source Warehouse</option>
                  {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                </select>
                <select value={form.toWarehouseId || ""} onChange={e => setForm({ ...form, toWarehouseId: e.target.value })}
                  className="bg-[#0f172a] text-gray-200 text-sm rounded-lg px-4 py-2.5 border border-gray-700 outline-none">
                  <option value="">Destination Warehouse</option>
                  {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                </select>
              </>
            ) : tab === "Adjustments" ? (
              <>
                <select value={form.warehouseId || ""} onChange={e => setForm({ ...form, warehouseId: e.target.value })}
                  className="bg-[#0f172a] text-gray-200 text-sm rounded-lg px-4 py-2.5 border border-gray-700 outline-none">
                  <option value="">Select Warehouse</option>
                  {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                </select>
                <input placeholder="Reason" value={form.reason || ""} onChange={e => setForm({ ...form, reason: e.target.value })}
                  className="bg-[#0f172a] text-gray-200 text-sm rounded-lg px-4 py-2.5 border border-gray-700 outline-none" />
              </>
            ) : (
              <>
                <select value={form.warehouseId || ""} onChange={e => setForm({ ...form, warehouseId: e.target.value })}
                  className="bg-[#0f172a] text-gray-200 text-sm rounded-lg px-4 py-2.5 border border-gray-700 outline-none">
                  <option value="">Select Warehouse</option>
                  {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                </select>
                <input placeholder={tab === "Receipts" ? "Supplier" : "Customer"} value={form.supplier || form.customer || ""}
                  onChange={e => setForm({ ...form, [tab === "Receipts" ? "supplier" : "customer"]: e.target.value })}
                  className="bg-[#0f172a] text-gray-200 text-sm rounded-lg px-4 py-2.5 border border-gray-700 outline-none" />
              </>
            )}
          </div>

          {/* Lines */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-300">Line Items</p>
              <button onClick={addLine} className="text-xs text-red-400 hover:text-red-300">+ Add Line</button>
            </div>
            {lines.map((line, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <select value={line.productId} onChange={e => updateLine(i, "productId", e.target.value)}
                  className="flex-1 bg-[#0f172a] text-gray-200 text-sm rounded-lg px-3 py-2 border border-gray-700 outline-none">
                  <option value="">Product</option>
                  {products.map(p => <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>)}
                </select>
                {tab === "Transfers" ? (
                  <>
                    <select value={line.fromLocationId} onChange={e => updateLine(i, "fromLocationId", e.target.value)}
                      className="flex-1 bg-[#0f172a] text-gray-200 text-sm rounded-lg px-3 py-2 border border-gray-700 outline-none">
                      <option value="">From Location</option>
                      {locations.map(l => <option key={l.id} value={l.id}>{l.name} ({l.code})</option>)}
                    </select>
                    <select value={line.toLocationId} onChange={e => updateLine(i, "toLocationId", e.target.value)}
                      className="flex-1 bg-[#0f172a] text-gray-200 text-sm rounded-lg px-3 py-2 border border-gray-700 outline-none">
                      <option value="">To Location</option>
                      {locations.map(l => <option key={l.id} value={l.id}>{l.name} ({l.code})</option>)}
                    </select>
                    <input type="number" placeholder="Qty" value={line.qty} onChange={e => updateLine(i, "qty", e.target.value)}
                      className="w-24 bg-[#0f172a] text-gray-200 text-sm rounded-lg px-3 py-2 border border-gray-700 outline-none" />
                  </>
                ) : (
                  <>
                    <select value={line.locationId} onChange={e => updateLine(i, "locationId", e.target.value)}
                      className="flex-1 bg-[#0f172a] text-gray-200 text-sm rounded-lg px-3 py-2 border border-gray-700 outline-none">
                      <option value="">Location</option>
                      {locations.map(l => <option key={l.id} value={l.id}>{l.name} ({l.code})</option>)}
                    </select>
                    <input type="number" placeholder={tab === "Receipts" ? "Expected Qty" : tab === "Adjustments" ? "Counted Qty" : "Demand Qty"}
                      value={line.expectedQty || line.demandQty || line.countedQty || ""}
                      onChange={e => updateLine(i, tab === "Receipts" ? "expectedQty" : tab === "Adjustments" ? "countedQty" : "demandQty", e.target.value)}
                      className="w-28 bg-[#0f172a] text-gray-200 text-sm rounded-lg px-3 py-2 border border-gray-700 outline-none" />
                  </>
                )}
                <button onClick={() => removeLine(i)} className="text-red-400 hover:text-red-300 text-lg px-2">×</button>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button onClick={handleCreate} className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white text-sm rounded-lg">Create</button>
            <button onClick={() => setShowForm(false)} className="px-5 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 text-sm rounded-lg">Cancel</button>
          </div>
        </div>
      )}

      {/* Items Table */}
      {loading ? <p className="text-gray-400">Loading…</p> : (
        <div className="bg-[#1e293b] rounded-xl border border-gray-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#0f172a] text-gray-400 text-xs uppercase">
              <tr>
                <th className="text-left px-5 py-3">Reference</th>
                <th className="text-left px-5 py-3">{tab === "Transfers" ? "Route" : "Warehouse"}</th>
                <th className="text-center px-5 py-3">Lines</th>
                <th className="text-center px-5 py-3">Status</th>
                <th className="text-left px-5 py-3">Date</th>
                <th className="text-right px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {items.map((item) => (
                <tr key={item.id} className="text-gray-300 hover:bg-white/5">
                  <td className="px-5 py-3 font-mono text-xs">{item.reference}</td>
                  <td className="px-5 py-3">
                    {tab === "Transfers"
                      ? `${item.fromWarehouseId?.substring(0, 8)}… → ${item.toWarehouseId?.substring(0, 8)}…`
                      : item.warehouse?.name || "—"}
                  </td>
                  <td className="px-5 py-3 text-center">{item.lines?.length || 0}</td>
                  <td className="px-5 py-3 text-center"><StatusBadge status={item.status} /></td>
                  <td className="px-5 py-3 text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-3 text-right space-x-2">
                    {item.status !== "done" && item.status !== "canceled" && (
                      <>
                        <button onClick={() => handleValidate(item.id)} className="text-green-400 hover:text-green-300 text-xs">Validate</button>
                        <button onClick={() => handleCancel(item.id)} className="text-red-400 hover:text-red-300 text-xs">Cancel</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-gray-500">No {tab.toLowerCase()} found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
