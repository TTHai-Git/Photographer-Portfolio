const getVietnamTime = () => {
  return new Date().toLocaleString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });
};

export const welcomeToServer = (req, res) => {
  return res.status(200).json({
    message: "Welcome to server of Hoang Truc Photography Portfolio!",
    timestamp: getVietnamTime(),
  });
};

export const welcomeToAPIsOfServer = (req, res) => {
  return res.status(200).json({
    message: "Welcome to the Hoang Truc Photography Portfolio API!",
    timestamp: getVietnamTime(),
  });
};
