import { useState, useEffect } from "react";
import api from "../api";
import { toast } from "react-toastify";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", parentId: "" });

  const fetchData = () => {
    setLoading(true);
    api.get("/categories").then(r => setCategories(r.data.data.categories || []))
      .catch(() => toast.error("Failed to load categories")).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const resetForm = () => { setForm({ name: "", parentId: "" }); setEditing(null); setShowForm(false); };

  const handleSubmit = async () => {
    try {
      const body = { name: form.name, parentId: form.parentId || null };
      if (editing) {
        await api.patch(`/categories/${editing}`, body);
        toast.success("Category updated");
      } else {
        await api.post("/categories", body);
        toast.success("Category created");
      }
      resetForm(); fetchData();
    } catch (err) { toast.error(err.response?.data?.message || "Error"); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this category?")) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success("Category deleted");
      fetchData();
    } catch (err) { toast.error(err.response?.data?.message || "Delete failed"); }
  };

  // Flatten for parent dropdown
  const allCats = [];
  categories.forEach(c => { allCats.push(c); (c.subCategories || []).forEach(s => allCats.push(s)); });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Categories</h1>
        <button onClick={() => { resetForm(); setShowForm(true); }}
          className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-medium rounded-lg">+ Add Category</button>
      </div>

      {showForm && (
        <div className="bg-[#1e293b] border border-gray-700 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">{editing ? "Edit Category" : "New Category"}</h2>
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              className="bg-[#0f172a] text-gray-200 text-sm rounded-lg px-4 py-2.5 border border-gray-700 outline-none" />
            <select value={form.parentId} onChange={e => setForm({ ...form, parentId: e.target.value })}
              className="bg-[#0f172a] text-gray-200 text-sm rounded-lg px-4 py-2.5 border border-gray-700 outline-none">
              <option value="">No Parent (Top Level)</option>
              {allCats.filter(c => c.id !== editing).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleSubmit} className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white text-sm rounded-lg">{editing ? "Update" : "Create"}</button>
            <button onClick={resetForm} className="px-5 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 text-sm rounded-lg">Cancel</button>
          </div>
        </div>
      )}

      {loading ? <p className="text-gray-400">Loading…</p> : (
        <div className="space-y-3">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-[#1e293b] rounded-xl border border-gray-800 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="text-base">🏷️</span>
                  <p className="text-white font-medium">{cat.name}</p>
                  {cat.subCategories?.length > 0 && (
                    <span className="text-xs text-gray-500">({cat.subCategories.length} subs)</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setForm({ name: cat.name, parentId: "" }); setEditing(cat.id); setShowForm(true); }}
                    className="text-blue-400 hover:text-blue-300 text-xs">Edit</button>
                  <button onClick={() => handleDelete(cat.id)}
                    className="text-red-400 hover:text-red-300 text-xs">Delete</button>
                </div>
              </div>
              {cat.subCategories?.length > 0 && (
                <div className="px-5 pb-4 flex flex-wrap gap-2">
                  {cat.subCategories.map((sub) => (
                    <div key={sub.id} className="flex items-center gap-2 px-3 py-1.5 bg-[#0f172a] rounded-lg border border-gray-700">
                      <span className="text-gray-300 text-sm">{sub.name}</span>
                      <button onClick={() => { setForm({ name: sub.name, parentId: cat.id }); setEditing(sub.id); setShowForm(true); }}
                        className="text-blue-400 hover:text-blue-300 text-[10px]">Edit</button>
                      <button onClick={() => handleDelete(sub.id)}
                        className="text-red-400 hover:text-red-300 text-[10px]">×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          {categories.length === 0 && <p className="text-gray-500 text-center py-8">No categories found</p>}
        </div>
      )}
    </div>
  );
}
