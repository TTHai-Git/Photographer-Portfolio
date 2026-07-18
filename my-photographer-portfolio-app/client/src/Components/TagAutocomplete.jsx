import { useEffect, useState } from "react";
import {
  Autocomplete,
  Chip,
  CircularProgress,
  TextField,
  Box
} from "@mui/material";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import CheckIcon from "@mui/icons-material/Check";

import { authApi } from "../config/APIs";
import { useNotification } from "../Context/NotificationContext";

export default function TagAutocomplete({
  value = [],
  onChange,
  label = "Tags",
  disabled = false
}) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const { showNotification } = useNotification();

  const loadTags = async () => {
    try {
      setLoading(true);

      const res = await authApi.get("/tags");
      setOptions(res.data.data || []);
    } catch (err) {
      showNotification(
        err.response?.data?.message || "Không thể tải danh sách tag",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTags();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Autocomplete
      multiple
      disableCloseOnSelect
      limitTags={5}
      disabled={disabled}
      loading={loading}
      options={options}
      value={value}
      onChange={(event, newValue) => onChange(newValue)}
      isOptionEqualToValue={(option, val) => option._id === val._id || option.name === val.name}
      getOptionLabel={(option) => option.name}
      filterSelectedOptions={false}
      fullWidth
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder="Chọn tags cho ảnh..."
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <>
                <LocalOfferIcon
                  sx={{ mr: 1, ml: 1, color: "#9e9e9e", fontSize: 20 }}
                />
                {params.InputProps.startAdornment}
              </>
            ),
            endAdornment: (
              <>
                {loading && <CircularProgress color="inherit" size={20} />}
                {params.InputProps.endAdornment}
              </>
            )
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              paddingLeft: "8px !important"
            }
          }}
        />
      )}
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((option, index) => (
          <Chip
            {...getTagProps({ index })}
            key={option._id || option.name}
            label={option.name}
            size="small"
            sx={{
              bgcolor: option.color || "#A9A9A9",
              color: "#fff",
              fontWeight: 500,
              boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
              "& .MuiChip-deleteIcon": {
                color: "rgba(255,255,255,0.7)",
                "&:hover": { color: "#fff" }
              }
            }}
          />
        ))
      }
      renderOption={(props, option, { selected }) => (
        <li
          {...props}
          key={option._id}
          style={{ ...props.style, padding: "6px 16px" }}>
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <Chip
              label={option.name}
              size="small"
              sx={{
                mr: 1.5,
                bgcolor: option.color || "#A9A9A9",
                color: "#fff",
                fontWeight: 500,
                minWidth: 60
              }}
            />
            <span style={{ flexGrow: 1, fontSize: 14 }}>{option.name}</span>
            {selected && <CheckIcon color="primary" fontSize="small" />}
          </Box>
        </li>
      )}
    />
  );
}
