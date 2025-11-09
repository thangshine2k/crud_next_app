"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Paper,
  Stack,
} from "@mui/material";

export default function ProjectDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchedRef = useRef(false);

  const fetchProject = async () => {
    try {
      const res = await fetch(`/api/v1/list-project/${id}`, {
        cache: "no-store",
      });

      if (!res.ok) {
        setProject(null);
        setLoading(false);
        return;
      }

      const result = await res.json();
      setProject(result.data || null);
    } catch (err) {
      console.error("Error fetching project:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    // fetch project
    fetchProject();
  }, [id]);

  if (loading) return <CircularProgress sx={{ mt: 5 }} />;

  if (!project) return <Typography>Không tìm thấy dự án.</Typography>;

  return (
    <Stack>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, color: "black", fontWeight: "bold" }} gutterBottom>
          Chi tiết dự án #{project.id}
        </Typography>
        <Typography>Tên: {project.name}</Typography>
        <Typography>Mô tả: {project.description}</Typography>
        <Typography>Trạng thái: {project.status}</Typography>
        <Typography>Ngày tạo: {project.created_at}</Typography>
        <Typography>Cập nhật: {project.updated_at}</Typography>

        <Box sx={{ mt: 3 }}>
          <Button variant="outlined" onClick={() => router.back()}>
            ← Quay lại danh sách
          </Button>
        </Box>
      </Paper>
    </Stack>
  );
}
