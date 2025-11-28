
import { createContext, useContext, useEffect, useState } from "react";
import { Snackbar, Alert } from "@mui/material";

const NotificationContext = createContext();

export const NotificationProvider = ({children}) => {
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("info");
  const [open, setOpen] = useState(false);
  const [cooldown, setCooldown] = useState(false); // ✅ chặn spam

  // ✅ Hiển thị thông báo có cooldown & auto fade
  const showNotification = (message, type) => {
    if (cooldown) return; // ⛔ không cho hiển thị thông báo kế tiếp trong lúc đang hiển thị

    setPopupMessage(message);
    setPopupType(type);
    setOpen(true);
    setCooldown(true);

    // Ẩn sau 5s (fade-out tự động)
    setTimeout(() => {
      setOpen(false);
      // Sau khi fade-out xong (300ms mặc định của MUI), cho phép hiển thị thông báo mới
      setTimeout(() => setCooldown(false), 300);
    }, 5000);
  };

  const handleClose = (
    event,
    reason,
  ) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };
  return (
    <NotificationContext.Provider value={{showNotification, handleClose}}>
        {children}
          {/* ✅ Global Snackbar Popup */}
      <Snackbar
        open={open}
        autoHideDuration={5000} // mờ dần sau 5s
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        TransitionProps={{ timeout: 400 }} // fade mượt
      >
        <Alert
          severity={popupType}
          onClose={handleClose}
          sx={{
            width: "100%",
            borderRadius: 2,
            boxShadow: 2,
            animation: "fadeIn 0.3s ease",
          }}
          variant="filled"
        >
          {popupMessage}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  )
}

export const useNotification = () => useContext(NotificationContext)