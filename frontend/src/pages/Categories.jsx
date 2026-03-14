import { useState, useEffect } from "react";
import api from "../api";
import { toast } from "react-toastify";
import { Plus, Tag, Pencil, Trash2, FolderTree } from "lucide-react";

export default function Categories() {

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    name: "",
    parentId: ""
  });

  const fetchData = () => {
    setLoading(true);

    api.get("/categories")
      .then(r => setCategories(r.data.data.categories || []))
      .catch(() => toast.error("Failed to load categories"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setForm({ name: "", parentId: "" });
    setEditing(null);
    setShowForm(false);
  };

  const handleSubmit = async () => {

    if (!form.name.trim()) {
      toast.error("Category name required");
      return;
    }

    try {

      const body = {
        name: form.name,
        parentId: form.parentId || null
      };

      if (editing) {
        await api.patch(`/categories/${editing}`, body);
        toast.success("Category updated");
      } else {
        await api.post("/categories", body);
        toast.success("Category created");
      }

      resetForm();
      fetchData();

    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    }
  };

  const handleDelete = async (id) => {

    if (!confirm("Delete this category?")) return;

    try {

      await api.delete(`/categories/${id}`);
      toast.success("Category deleted");

      fetchData();

    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  /* flatten categories for dropdown */

  const allCats = [];
  categories.forEach(c => {
    allCats.push(c);
    (c.subCategories || []).forEach(s => allCats.push(s));
  });

  return (

    <div className="max-w-full space-y-8">

      {/* HEADER */}

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Categories
          </h1>

          <p className="text-sm text-gray-500">
            Organize products using category hierarchy
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm px-4 py-2 rounded-lg shadow-sm transition"
        >
          <Plus size={16} />
          Add Category
        </button>

      </div>

      {/* FORM CARD */}

      {showForm && (

        <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">

          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">

            {editing ? "Edit Category" : "Create New Category"}

          </h2>

          <div className="grid grid-cols-2 gap-4">

            <div>
              <label className="text-xs text-gray-500 block mb-1">
                Category Name
              </label>

              <input
                value={form.name}
                onChange={e =>
                  setForm({ ...form, name: e.target.value })
                }
                placeholder="Enter category name"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2 bg-gray-50 dark:bg-[#020617] outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-xs text-gray-500 block mb-1">
                Parent Category
              </label>

              <select
                value={form.parentId}
                onChange={e =>
                  setForm({ ...form, parentId: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2 bg-gray-50 dark:bg-[#020617] outline-none focus:ring-2 focus:ring-blue-500"
              >

                <option value="">Top Level</option>

                {allCats
                  .filter(c => c.id !== editing)
                  .map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}

              </select>
            </div>

          </div>

          <div className="flex gap-3 mt-6">

            <button
              onClick={handleSubmit}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm"
            >
              {editing ? "Update Category" : "Create Category"}
            </button>

            <button
              onClick={resetForm}
              className="px-5 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg text-sm"
            >
              Cancel
            </button>

          </div>

        </div>

      )}

      {/* CATEGORY LIST */}

      {loading ? (

        <p className="text-gray-500">Loading categories...</p>

      ) : (

        <div className="space-y-4">

          {categories.map(cat => (

            <div
              key={cat.id}
              className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm"
            >

              {/* MAIN CATEGORY */}

              <div className="flex items-center justify-between px-6 py-4">

                <div className="flex items-center gap-3">

                  <Tag size={18} className="text-gray-500" />

                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {cat.name}
                  </span>

                  {cat.subCategories?.length > 0 && (
                    <span className="text-xs text-gray-400">
                      ({cat.subCategories.length} sub categories)
                    </span>
                  )}

                </div>

                <div className="flex gap-3">

                  <button
                    onClick={() => {
                      setForm({ name: cat.name, parentId: "" });
                      setEditing(cat.id);
                      setShowForm(true);
                    }}
                    className="flex items-center gap-1 text-blue-500 hover:text-blue-400 text-sm"
                  >
                    <Pencil size={14} />
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="flex items-center gap-1 text-red-500 hover:text-red-400 text-sm"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>

                </div>

              </div>

              {/* SUBCATEGORIES */}

              {cat.subCategories?.length > 0 && (

                <div className="px-6 pb-4 flex flex-wrap gap-2">

                  {cat.subCategories.map(sub => (

                    <div
                      key={sub.id}
                      className="flex items-center gap-2 bg-gray-100 dark:bg-[#020617] px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700"
                    >

                      <FolderTree size={14} className="text-gray-400" />

                      <span className="text-sm text-gray-800 dark:text-gray-200">
                        {sub.name}
                      </span>

                      <button
                        onClick={() => {
                          setForm({ name: sub.name, parentId: cat.id });
                          setEditing(sub.id);
                          setShowForm(true);
                        }}
                        className="text-blue-500 hover:text-blue-400 text-xs"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(sub.id)}
                        className="text-red-500 hover:text-red-400 text-xs"
                      >
                        ×
                      </button>

                    </div>

                  ))}

                </div>

              )}

            </div>

          ))}

          {categories.length === 0 && (

            <div className="text-center py-12 text-gray-500">

              <Tag size={40} className="mx-auto mb-3 opacity-40" />

              No categories found

            </div>

          )}

        </div>

      )}

    </div>

  );
}