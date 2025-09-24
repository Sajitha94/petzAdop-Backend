import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongodbURl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@recipecluster.6dhwohq.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=RecipeCluster`;
    await mongoose.connect(mongodbURl);
    console.log("MongoDB Connected");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

export default connectDB;
