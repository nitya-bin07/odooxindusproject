import { useState, useEffect } from "react";
import api from "../api";
import { toast } from "react-toastify";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", sku: "", categoryId: "", unitOfMeasure: "unit", description: "", reorderPoint: 0 });

  const fetchProducts = () => {
    setLoading(true);
    api.get("/products", { params: { search: search || undefined } })
      .then((res) => setProducts(res.data.data.products))
      .catch(() => toast.error("Failed to load products"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, [search]);
  useEffect(() => {
    api.get("/categories").then((res) => setCategories(res.data.data.categories || [])).catch(() => {});
  }, []);

  const resetForm = () => { setForm({ name: "", sku: "", categoryId: "", unitOfMeasure: "unit", description: "", reorderPoint: 0 }); setEditing(null); setShowForm(false); };

  const handleSubmit = async () => {
    try {
      if (editing) {
        await api.patch(`/products/${editing}`, form);
        toast.success("Product updated");
      } else {
        await api.post("/products", form);
        toast.success("Product created");
      }
      resetForm();
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving product");
    }
  };

  const handleEdit = (p) => {
    setForm({ name: p.name, sku: p.sku, categoryId: p.categoryId || "", unitOfMeasure: p.unitOfMeasure, description: p.description || "", reorderPoint: p.reorderPoint });
    setEditing(p.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success("Product deleted");
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Products</h1>
        <button onClick={() => { resetForm(); setShowForm(true); }}
          className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-medium rounded-lg transition-all">
          + Add Product
        </button>
      </div>

      {/* Search */}
      <input
        type="text" placeholder="Search by name or SKU…" value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-6 bg-[#1e293b] text-gray-200 text-sm rounded-lg px-4 py-3 border border-gray-700 outline-none focus:border-red-500"
      />

      {/* Form Modal */}
      {showForm && (
        <div className="bg-[#1e293b] border border-gray-700 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">{editing ? "Edit Product" : "New Product"}</h2>
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="bg-[#0f172a] text-gray-200 text-sm rounded-lg px-4 py-2.5 border border-gray-700 outline-none" />
            <input placeholder="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} disabled={!!editing}
              className="bg-[#0f172a] text-gray-200 text-sm rounded-lg px-4 py-2.5 border border-gray-700 outline-none disabled:opacity-50" />
            <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              className="bg-[#0f172a] text-gray-200 text-sm rounded-lg px-4 py-2.5 border border-gray-700 outline-none">
              <option value="">No Category</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <input placeholder="Unit (e.g. unit, box, kg)" value={form.unitOfMeasure}
              onChange={(e) => setForm({ ...form, unitOfMeasure: e.target.value })}
              className="bg-[#0f172a] text-gray-200 text-sm rounded-lg px-4 py-2.5 border border-gray-700 outline-none" />
            <input placeholder="Reorder Point" type="number" value={form.reorderPoint}
              onChange={(e) => setForm({ ...form, reorderPoint: e.target.value })}
              className="bg-[#0f172a] text-gray-200 text-sm rounded-lg px-4 py-2.5 border border-gray-700 outline-none" />
            <input placeholder="Description" value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="bg-[#0f172a] text-gray-200 text-sm rounded-lg px-4 py-2.5 border border-gray-700 outline-none" />
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleSubmit}
              className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white text-sm rounded-lg">{editing ? "Update" : "Create"}</button>
            <button onClick={resetForm}
              className="px-5 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 text-sm rounded-lg">Cancel</button>
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? <p className="text-gray-400">Loading…</p> : (
        <div className="bg-[#1e293b] rounded-xl border border-gray-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#0f172a] text-gray-400 text-xs uppercase">
              <tr>
                <th className="text-left px-5 py-3">Name</th>
                <th className="text-left px-5 py-3">SKU</th>
                <th className="text-left px-5 py-3">Category</th>
                <th className="text-right px-5 py-3">Stock</th>
                <th className="text-center px-5 py-3">Status</th>
                <th className="text-right px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {products.map((p) => (
                <tr key={p.id} className="text-gray-300 hover:bg-white/5">
                  <td className="px-5 py-3 font-medium">{p.name}</td>
                  <td className="px-5 py-3 text-gray-500 font-mono">{p.sku}</td>
                  <td className="px-5 py-3">{p.category?.name || "—"}</td>
                  <td className="px-5 py-3 text-right font-mono">{p.totalQty ?? 0}</td>
                  <td className="px-5 py-3 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      p.isOutOfStock ? "bg-red-900/40 text-red-400"
                        : p.isLowStock ? "bg-yellow-900/40 text-yellow-400"
                        : "bg-green-900/40 text-green-400"
                    }`}>
                      {p.isOutOfStock ? "Out" : p.isLowStock ? "Low" : "OK"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right space-x-2">
                    <button onClick={() => handleEdit(p)} className="text-blue-400 hover:text-blue-300 text-xs">Edit</button>
                    <button onClick={() => handleDelete(p.id)} className="text-red-400 hover:text-red-300 text-xs">Delete</button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-gray-500">No products found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}