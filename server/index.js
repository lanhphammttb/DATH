const express = require("express");
const mongoose = require("mongoose");
const app = express();

const uri = "mongodb+srv://lanhphammttb:HIr8cB5F7jaPY8Ze@lanhpham.xs8cpwm.mongodb.net/DATH?retryWrites=true&w=majority";

async function connect() {
    try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error(error);
    }
}

connect();

app.listen(8000, () => {
    console.log("Server started on port 8000");
});