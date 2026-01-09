import mongoose from "mongoose"

let db;

export const inItDb = async () => {
    try {
        let db = await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/naijafix")
        // let db = await mongoose.connect("mongodb+srv://FadairoMarvel:xCWvJlVLsi3JjjhL@naijafix.6a3r3eg.mongodb.net/?appName=Naijafix")
        console.log("MongoDB connected locally");
        
        
    } catch (error) {
        console.error("MongoDB connection failed")
    }
}


export async function getDB() {
    if(!db) throw new Error('Database not initialized')
    return db
}
