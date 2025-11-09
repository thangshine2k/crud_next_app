"use client";
import { useState, useRef } from "react";
import {
  Autocomplete,
  TextField,
  CircularProgress,
  Box,
  Typography,
} from "@mui/material";

const allOptions = [
  "active",
  "draft",
  "archived",
  "completed",
  "cancelled",
  "pending",
  "rejected",
  "approved",
  "test",
  "production",
  "demo",
  "staging",
  "development",
];

export default function LoadMoreAutocomplete({ form, setForm }) {
  const pageSize = 10;
  const [options, setOptions] = useState(() => allOptions.slice(0, pageSize));
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const listboxRef = useRef();

  const handleScroll = (e) => {
    const listboxNode = e.currentTarget;
    if (
      listboxNode.scrollTop + listboxNode.clientHeight >=
      listboxNode.scrollHeight - 1
    ) {
      if (page * pageSize >= allOptions.length) return;
      setLoading(true);
      setTimeout(() => {
        const nextPage = page + 1;
        setOptions(allOptions.slice(0, nextPage * pageSize));
        setPage(nextPage);
        setLoading(false);
      }, 500);
    }
  };

  return (
    <Box sx={{mt: 1}}>
      <Autocomplete
        value={form.status}
        onChange={(event, newValue) => setForm({ ...form, status: newValue })}
        options={options}
        size="small"
        ListboxProps={{
          onScroll: handleScroll,
          ref: listboxRef,
          style: { maxHeight: 200, overflow: "auto" },
        }}
        renderOption={(props, option) => {
          const { key, ...rest } = props;
          return (
            <li key={key} {...rest}>
              {option}
            </li>
          );
        }}
        renderInput={(params) => (
          <TextField {...params} label="Status" variant="outlined" />
        )}
        renderGroup={(params) => (
          <>
            {params.children}
            {loading && (
              <Box textAlign="center" p={3}>
                <CircularProgress size={20} />
                <Typography variant="caption">Loading...</Typography>
              </Box>
            )}
          </>
        )}
      />
    </Box>
  );
}
