const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // يمكنك إضافة إعدادات أخرى هنا إذا لزم الأمر
    });
    console.log("MongoDB connected...");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // أخرج من العملية إذا فشل الاتصال بقاعدة البيانات
  }
};

module.exports = connectDB;
