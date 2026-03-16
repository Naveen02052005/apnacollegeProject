//  To enter into database we need to execute this by following below commands
// cd init
// node index.js

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../Models/listing.js")


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust" // we will find this in mongoose website copy it and paste but instead of wanderlust paste your database name

main().then(()=>{
    console.log("Connected to DB");
}).catch(err=>{
    console.log(err);
});

async function main()
{
    await mongoose.connect(MONGO_URL);
}

const initDB = async () =>{
    await Listing.deleteMany({}); // if any data is present then 1st it deletes
    initData.data = initData.data.map((obj) => ({...obj, owner: "698f43127f7d24361b1f7cef"}))
    await Listing.insertMany(initData.data); // after deleting it inserts the data
    console.log("Data was Initialized");
}

initDB();