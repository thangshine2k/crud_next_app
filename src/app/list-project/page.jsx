"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import CommonTable from "../component/list-project/CommonTable";
import LoadMoreAutocomplete from "../component/LoadMoreAutocomplete";

export default function ProjectListPage() {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState(null);
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    description: "",
    status: "active",
    created_at: "",
    updated_at: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const fetchData = async () => {
    let isMounted = true;
    try {
      const res = await fetch("/api/v1/list-project", { cache: "no-store" });
      const result = await res.json();
      if (isMounted) setData(result.data || []);
    } catch (err) {
      console.error(err);
    }
    return () => {
      isMounted = false;
    };
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRowClick = (row) => {
    setSelected(row);
    router.push(`/list-project/${row.id}`);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleAdd = () => {
    setOpenDialog(true);
    setForm({
      name: "",
      description: "",
      status: "active",
      created_at: "",
      updated_at: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!e.target.checkValidity()) {
      e.target.reportValidity();
      return;
    }

    try {
      const url = editingId
        ? `/api/v1/list-project/${editingId}`
        : "/api/v1/list-project";

      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!data.success)
        throw new Error(data.message || "Error saving project");

      setForm({
        name: "",
        description: "",
        status: "active",
        created_at: "",
        updated_at: "",
      });
      setEditingId(null);
      setOpenDialog(false);
      fetchData();
    } catch (err) {
      console.error("Submit error:", err);
      alert(err.message || "Server error");
    }
  };

  const handleEdit = (p) => {
    setForm({
      name: p.name,
      description: p.description,
      status: p.status,
      created_at: p.created_at,
      updated_at: p.updated_at,
    });
    setEditingId(p.id);
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/v1/list-project/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      console.log(data);
      if (!res.ok) throw new Error(data.error || "Delete failed");
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <Button variant="contained" onClick={handleAdd}>
        Add
      </Button>

      <Dialog
        open={openDialog}
        onClose={(event, reason) => {
          if (reason === "backdropClick" || reason === "escapeKeyDown") return;
          handleCloseDialog();
        }}
        keepMounted
      >
        <DialogTitle>
          {editingId ? "Update Project" : "Add Project"}
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Name"
              name="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              fullWidth
              margin="dense"
            />
            <TextField
              label="Description"
              name="description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              required
              fullWidth
              margin="dense"
            />
            <LoadMoreAutocomplete form={form} setForm={setForm} />
            <TextField
              label="Created At"
              name="created_at"
              value={form.created_at}
              onChange={(e) => setForm({ ...form, created_at: e.target.value })}
              required
              fullWidth
              margin="dense"
            />
            <TextField
              label="Updated At"
              name="updated_at"
              value={form.updated_at}
              onChange={(e) => setForm({ ...form, updated_at: e.target.value })}
              required
              fullWidth
              margin="dense"
            />
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button type="submit" variant="contained" color="primary">
                {editingId ? "Update" : "Add"}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
      <Typography variant="h5" sx={{ mb: 2, color: "black" }}>
        Danh sách dự án
      </Typography>
      <CommonTable
        data={data}
        selected={selected}
        onRowClick={handleRowClick}
        onEdit={(row) => handleEdit(row)}
        onDelete={(id) => handleDelete(id)}
      />
    </div>
  );
}
