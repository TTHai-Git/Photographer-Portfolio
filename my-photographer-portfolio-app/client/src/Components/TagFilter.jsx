import React from "react";
import TagAutocomplete from "./TagAutocomplete";
import { Box } from "@mui/material";

export default function TagFilter({ selectedTags = [], onTagsChange }) {
  return (
    <Box sx={{ minWidth: { xs: '100%', sm: 300 }, maxWidth: 500, flexGrow: 1 }}>
      <TagAutocomplete
        value={selectedTags}
        onChange={onTagsChange}
        label="Lọc theo Tags"
      />
    </Box>
  );
}
