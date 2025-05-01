import mongoose from "mongoose";

const connectDB = async () => {
    try {   
        mongoose.connection.on('connected', () => 
         console.log( `MongoDB Connected`))
        await mongoose.connect(`${process.env.MONGODB_URI}/greencart`);
}
         catch (error) {
        console.error(error.message);
        process.exit(1);
    }
    }
    export default connectDB;