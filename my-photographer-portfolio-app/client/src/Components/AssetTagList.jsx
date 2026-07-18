import { Stack, Chip, Tooltip, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

/**
 * AssetTagList
 *
 * props:
 *  - tags: Array<Tag>
 *  - maxTags: số tag hiển thị tối đa
 *  - onEdit: function trigger when clicking edit
 */
export default function AssetTagList({ tags = [], maxTags = 3, onEdit }) {
  const hasTags = tags && tags.length > 0;
  const visibleTags = hasTags ? tags.slice(0, maxTags) : [];
  const remain = hasTags ? tags.length - maxTags : 0;

  return (
    <Stack
      direction="row"
      spacing={0.5}
      alignItems="center"
      flexWrap="wrap"
      sx={{ mt: 1, minHeight: 28 }}
    >
      {!hasTags ? (
        <span
          style={{
            fontSize: 12,
            color: "#999",
            display: "flex",
            alignItems: "center",
            gap: 4
          }}
        >
          <LocalOfferIcon sx={{ fontSize: 14 }} /> Chưa có tag
        </span>
      ) : (
        <>
          {visibleTags.map((tag) => (
            <Tooltip key={tag._id} title={tag.name} arrow>
              <Chip
                size="small"
                label={tag.name}
                sx={{
                  backgroundColor: tag.color || "#b42e2eff",
                  color: "#fff",
                  fontWeight: 500,
                  fontSize: 11,
                  mb: 0.5,
                  cursor: "default",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
                  "& .MuiChip-label": { px: 1 }
                }}
              />
            </Tooltip>
          ))}

          {remain > 0 && (
            <Chip
              size="small"
              label={`+${remain}`}
              sx={{
                background: "#eeeeee",
                color: "#555",
                fontWeight: 600,
                mb: 0.5,
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            />
          )}
        </>
      )}

      {onEdit && (
        <Tooltip title="Quản lý tags" arrow>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            sx={{
              mb: 0.5,
              ml: 0.5,
              width: 24,
              height: 24,
              bgcolor: "rgba(0,0,0,0.04)",
              "&:hover": { bgcolor: "rgba(0,0,0,0.08)" }
            }}
          >
            <EditIcon sx={{ fontSize: 14, color: "#555" }} />
          </IconButton>
        </Tooltip>
      )}
    </Stack>
  );
}
