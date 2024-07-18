import mongoose from "mongoose";


const MONGODB_URI = process.env.MONGO_URI

const connect = async () =>{
    const connection = mongoose.connection.readyState

    if(connection === 1) {
        console.log("Database connected!")
    }

    if(connection === 2){
        console.log("Db connecting...")
    }

    try{
        mongoose.connect(MONGODB_URI!, {
            dbName:"restapinext14",
            bufferCommands: false
        }) 
    } catch(error){
        console.log("Something went wrong: " + error);
        throw new Error("Error connecting to database");
    }
}

export default connect;