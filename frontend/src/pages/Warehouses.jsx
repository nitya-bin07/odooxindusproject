import { useState, useEffect } from "react";
import api from "../api";
import { toast } from "react-toastify";

import {
  Warehouse,
  MapPin,
  Plus,
  Pencil,
  Trash2,
  Boxes
} from "lucide-react";

export default function Warehouses() {

  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    name: "",
    code: "",
    address: ""
  });

  const [locForm, setLocForm] = useState({
    warehouseId: "",
    name: "",
    code: "",
    type: "internal"
  });

  const [showLocForm, setShowLocForm] = useState(false);

  const fetchData = () => {
    setLoading(true);

    api.get("/warehouses")
      .then(r => setWarehouses(r.data.data.warehouses || []))
      .catch(() => toast.error("Failed to load warehouses"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setForm({ name: "", code: "", address: "" });
    setEditing(null);
    setShowForm(false);
  };

  const handleSubmitWH = async () => {

    if (!form.name || !form.code) {
      toast.error("Warehouse name and code required");
      return;
    }

    try {

      if (editing) {
        await api.patch(`/warehouses/${editing}`, {
          name: form.name,
          address: form.address
        });

        toast.success("Warehouse updated");

      } else {

        await api.post("/warehouses", form);

        toast.success("Warehouse created");

      }

      resetForm();
      fetchData();

    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    }
  };

  const handleDeleteWH = async (id) => {

    if (!confirm("Delete this warehouse?")) return;

    try {

      await api.delete(`/warehouses/${id}`);
      toast.success("Warehouse deleted");

      fetchData();

    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  const handleEditWH = (w) => {
    setForm({
      name: w.name,
      code: w.code,
      address: w.address || ""
    });

    setEditing(w.id);
    setShowForm(true);
  };

  const handleSubmitLoc = async () => {

    if (!locForm.warehouseId || !locForm.name) {
      toast.error("Location name and warehouse required");
      return;
    }

    try {

      await api.post("/locations", locForm);

      toast.success("Location created");

      setShowLocForm(false);

      setLocForm({
        warehouseId: "",
        name: "",
        code: "",
        type: "internal"
      });

      fetchData();

    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    }
  };

  return (

    <div className="max-w-6xl space-y-8">

      {/* HEADER */}

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">

            <Warehouse size={22} />

            Warehouses

          </h1>

          <p className="text-sm text-gray-500">
            Manage storage facilities and their internal locations
          </p>

        </div>

        <div className="flex gap-3">

          <button
            onClick={() => setShowLocForm(!showLocForm)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-4 py-2 rounded-lg shadow-sm"
          >
            <MapPin size={16} />
            Add Location
          </button>

          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm px-4 py-2 rounded-lg shadow-sm"
          >
            <Plus size={16} />
            Add Warehouse
          </button>

        </div>

      </div>

      {/* WAREHOUSE FORM */}

      {showForm && (

        <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">

          <h2 className="text-lg font-semibold mb-5 text-gray-900 dark:text-white">

            {editing ? "Edit Warehouse" : "Create Warehouse"}

          </h2>

          <div className="grid grid-cols-3 gap-4">

            <input
              placeholder="Warehouse Name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2 bg-gray-50 dark:bg-[#020617] outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              placeholder="Code"
              value={form.code}
              disabled={!!editing}
              onChange={e => setForm({ ...form, code: e.target.value })}
              className="rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2 bg-gray-50 dark:bg-[#020617] outline-none disabled:opacity-50"
            />

            <input
              placeholder="Address"
              value={form.address}
              onChange={e => setForm({ ...form, address: e.target.value })}
              className="rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2 bg-gray-50 dark:bg-[#020617] outline-none"
            />

          </div>

          <div className="flex gap-3 mt-6">

            <button
              onClick={handleSubmitWH}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm"
            >
              {editing ? "Update Warehouse" : "Create Warehouse"}
            </button>

            <button
              onClick={resetForm}
              className="px-5 py-2 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg text-sm"
            >
              Cancel
            </button>

          </div>

        </div>

      )}

      {/* LOCATION FORM */}

      {showLocForm && (

        <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">

          <h2 className="text-lg font-semibold mb-5 text-gray-900 dark:text-white">
            Create Location
          </h2>

          <div className="grid grid-cols-4 gap-4">

            <select
              value={locForm.warehouseId}
              onChange={e => setLocForm({ ...locForm, warehouseId: e.target.value })}
              className="rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2 bg-gray-50 dark:bg-[#020617]"
            >
              <option value="">Warehouse</option>
              {warehouses.map(w => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>

            <input
              placeholder="Location Name"
              value={locForm.name}
              onChange={e => setLocForm({ ...locForm, name: e.target.value })}
              className="rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2 bg-gray-50 dark:bg-[#020617]"
            />

            <input
              placeholder="Code"
              value={locForm.code}
              onChange={e => setLocForm({ ...locForm, code: e.target.value })}
              className="rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2 bg-gray-50 dark:bg-[#020617]"
            />

            <select
              value={locForm.type}
              onChange={e => setLocForm({ ...locForm, type: e.target.value })}
              className="rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2 bg-gray-50 dark:bg-[#020617]"
            >
              <option value="internal">Internal</option>
              <option value="input">Input</option>
              <option value="output">Output</option>
              <option value="transit">Transit</option>
            </select>

          </div>

          <div className="flex gap-3 mt-6">

            <button
              onClick={handleSubmitLoc}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm"
            >
              Create Location
            </button>

            <button
              onClick={() => setShowLocForm(false)}
              className="px-5 py-2 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg text-sm"
            >
              Cancel
            </button>

          </div>

        </div>

      )}

      {/* WAREHOUSE LIST */}

      {loading ? (

        <p className="text-gray-500">Loading warehouses...</p>

      ) : (

        <div className="space-y-4">

          {warehouses.map(w => (

            <div
              key={w.id}
              className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm"
            >

              {/* WAREHOUSE HEADER */}

              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">

                <div>

                  <p className="font-semibold text-gray-900 dark:text-white">

                    {w.name}

                    <span className="ml-2 text-xs text-gray-400">
                      {w.code}
                    </span>

                  </p>

                  {w.address && (
                    <p className="text-xs text-gray-500 mt-1">
                      {w.address}
                    </p>
                  )}

                </div>

                <div className="flex gap-4">

                  <button
                    onClick={() => handleEditWH(w)}
                    className="flex items-center gap-1 text-blue-500 hover:text-blue-400 text-sm"
                  >
                    <Pencil size={14} />
                    Edit
                  </button>

                  <button
                    onClick={() => handleDeleteWH(w.id)}
                    className="flex items-center gap-1 text-red-500 hover:text-red-400 text-sm"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>

                </div>

              </div>

              {/* LOCATIONS */}

              {w.locations?.length > 0 && (

                <div className="px-6 py-4">

                  <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                    <Boxes size={14} />
                    Locations ({w.locations.length})
                  </p>

                  <div className="flex flex-wrap gap-2">

                    {w.locations.map(l => (

                      <span
                        key={l.id}
                        className="px-3 py-1 text-xs rounded-lg bg-gray-100 dark:bg-[#020617] border border-gray-200 dark:border-gray-700"
                      >

                        {l.name}

                        <span className="text-gray-400 ml-1">
                          ({l.code})
                        </span>

                      </span>

                    ))}

                  </div>

                </div>

              )}

            </div>

          ))}

          {warehouses.length === 0 && (

            <p className="text-center text-gray-500 py-12">
              No warehouses found
            </p>

          )}

        </div>

      )}

    </div>

  );

}