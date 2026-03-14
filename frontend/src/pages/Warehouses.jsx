import { useState, useEffect } from "react";
import api from "../api";
import { toast } from "react-toastify";

export default function Warehouses() {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", code: "", address: "" });
  const [locForm, setLocForm] = useState({ warehouseId: "", name: "", code: "", type: "internal" });
  const [showLocForm, setShowLocForm] = useState(false);

  const fetchData = () => {
    setLoading(true);
    api.get("/warehouses").then(r => setWarehouses(r.data.data.warehouses || []))
      .catch(() => toast.error("Failed to load warehouses")).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const resetForm = () => { setForm({ name: "", code: "", address: "" }); setEditing(null); setShowForm(false); };

  const handleSubmitWH = async () => {
    try {
      if (editing) {
        await api.patch(`/warehouses/${editing}`, { name: form.name, address: form.address });
        toast.success("Warehouse updated");
      } else {
        await api.post("/warehouses", form);
        toast.success("Warehouse created");
      }
      resetForm(); fetchData();
    } catch (err) { toast.error(err.response?.data?.message || "Error"); }
  };

  const handleDeleteWH = async (id) => {
    if (!confirm("Delete this warehouse?")) return;
    try {
      await api.delete(`/warehouses/${id}`);
      toast.success("Warehouse deleted");
      fetchData();
    } catch (err) { toast.error(err.response?.data?.message || "Delete failed"); }
  };

  const handleEditWH = (w) => { setForm({ name: w.name, code: w.code, address: w.address || "" }); setEditing(w.id); setShowForm(true); };

  const handleSubmitLoc = async () => {
    try {
      await api.post("/locations", locForm);
      toast.success("Location created");
      setShowLocForm(false); setLocForm({ warehouseId: "", name: "", code: "", type: "internal" }); fetchData();
    } catch (err) { toast.error(err.response?.data?.message || "Error"); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Warehouses</h1>
        <div className="flex gap-2">
          <button onClick={() => setShowLocForm(!showLocForm)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg">+ Add Location</button>
          <button onClick={() => { resetForm(); setShowForm(true); }}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-medium rounded-lg">+ Add Warehouse</button>
        </div>
      </div>

      {/* WH Form */}
      {showForm && (
        <div className="bg-[#1e293b] border border-gray-700 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">{editing ? "Edit Warehouse" : "New Warehouse"}</h2>
          <div className="grid grid-cols-3 gap-4">
            <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              className="bg-[#0f172a] text-gray-200 text-sm rounded-lg px-4 py-2.5 border border-gray-700 outline-none" />
            <input placeholder="Code" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} disabled={!!editing}
              className="bg-[#0f172a] text-gray-200 text-sm rounded-lg px-4 py-2.5 border border-gray-700 outline-none disabled:opacity-50" />
            <input placeholder="Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}
              className="bg-[#0f172a] text-gray-200 text-sm rounded-lg px-4 py-2.5 border border-gray-700 outline-none" />
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleSubmitWH} className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white text-sm rounded-lg">{editing ? "Update" : "Create"}</button>
            <button onClick={resetForm} className="px-5 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 text-sm rounded-lg">Cancel</button>
          </div>
        </div>
      )}

      {/* Location Form */}
      {showLocForm && (
        <div className="bg-[#1e293b] border border-gray-700 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">New Location</h2>
          <div className="grid grid-cols-4 gap-4">
            <select value={locForm.warehouseId} onChange={e => setLocForm({ ...locForm, warehouseId: e.target.value })}
              className="bg-[#0f172a] text-gray-200 text-sm rounded-lg px-4 py-2.5 border border-gray-700 outline-none">
              <option value="">Warehouse</option>
              {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
            </select>
            <input placeholder="Name" value={locForm.name} onChange={e => setLocForm({ ...locForm, name: e.target.value })}
              className="bg-[#0f172a] text-gray-200 text-sm rounded-lg px-4 py-2.5 border border-gray-700 outline-none" />
            <input placeholder="Code" value={locForm.code} onChange={e => setLocForm({ ...locForm, code: e.target.value })}
              className="bg-[#0f172a] text-gray-200 text-sm rounded-lg px-4 py-2.5 border border-gray-700 outline-none" />
            <select value={locForm.type} onChange={e => setLocForm({ ...locForm, type: e.target.value })}
              className="bg-[#0f172a] text-gray-200 text-sm rounded-lg px-4 py-2.5 border border-gray-700 outline-none">
              <option value="internal">Internal</option>
              <option value="input">Input</option>
              <option value="output">Output</option>
              <option value="transit">Transit</option>
            </select>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleSubmitLoc} className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg">Create</button>
            <button onClick={() => setShowLocForm(false)} className="px-5 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 text-sm rounded-lg">Cancel</button>
          </div>
        </div>
      )}

      {/* WH List */}
      {loading ? <p className="text-gray-400">Loading…</p> : (
        <div className="space-y-4">
          {warehouses.map((w) => (
            <div key={w.id} className="bg-[#1e293b] rounded-xl border border-gray-800 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
                <div>
                  <p className="text-white font-semibold">{w.name} <span className="text-gray-500 text-xs ml-2">{w.code}</span></p>
                  {w.address && <p className="text-gray-500 text-xs mt-1">{w.address}</p>}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEditWH(w)} className="text-blue-400 hover:text-blue-300 text-xs">Edit</button>
                  <button onClick={() => handleDeleteWH(w.id)} className="text-red-400 hover:text-red-300 text-xs">Delete</button>
                </div>
              </div>
              {w.locations?.length > 0 && (
                <div className="px-5 py-3">
                  <p className="text-xs text-gray-500 mb-2">Locations ({w.locations.length})</p>
                  <div className="flex flex-wrap gap-2">
                    {w.locations.map((l) => (
                      <span key={l.id} className="px-3 py-1 bg-[#0f172a] text-gray-300 text-xs rounded-lg border border-gray-700">
                        {l.name} <span className="text-gray-500">({l.code})</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          {warehouses.length === 0 && <p className="text-gray-500 text-center py-8">No warehouses found</p>}
        </div>
      )}
    </div>
  );
}
