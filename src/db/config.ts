import mongoose from "mongoose"
import 'dotenv/config'

const uri: string = process.env.MONGODB_URI || ""

export default async function run() {
  mongoose.set("strictQuery", true)

  try {
    await mongoose.connect(uri)
  } catch (err) {
    console.log(err)
    return;
  }

  console.log("\nConected to the database\n");
}