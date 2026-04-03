const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("DB URI:", process.env.DB_URI); //debug line

    await mongoose.connect(process.env.DB_URI);

    console.log("MongoDB Connected");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;