import mongoose from "mongoose"

let db;

export const inItDb = async () => {
    try {
        let db = await mongoose.connect("mongodb://127.0.0.1:27017/naijafix")
        console.log("MongoDB connected locally");
        
        
    } catch (error) {
        console.error("MongoDB connection failed")
    }
}


export async function getDB() {
    if(!db) throw new Error('Database not initialized')
    return db
}
