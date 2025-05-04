import mongoose from "mongoose";


const AddressSchema = new mongoose.Schema({
userId:{type:String,required:true},
firstName:{type:String,required:true},
lastName:{type:String,required:true},
email:{type:String,required:true},
street:{type:String,required:true},
city:{type:String,required:true},
state:{type:String,required:true},
country:{type:String,required:true},
zipCode:{type:Number,required:true},
phone:{type:String,required:true},

})

const Address =mongoose.models.address || mongoose.model("address", AddressSchema);
export default Address;