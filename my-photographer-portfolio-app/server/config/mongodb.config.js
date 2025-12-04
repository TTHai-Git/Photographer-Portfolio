import { connect } from "mongoose";
// Connect to MongoDB (run once)
const handleConnectToMongoDB = () => {
  connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Connected to MongoDB!"))
    .catch((error) =>
      console.error("Error connecting to MongoDB:", error.message)
    );
};

export default handleConnectToMongoDB;
