const express = require("express");
const app = express();
const cors = require('cors');
var mysql = require('mysql');

let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    port: '3306',  /* port on which phpmyadmin run */
    password: '1704',
    database: 'dath'  
});

connection.connect(function(err) {
    if (err) {
      return console.error('error: ' + err.message);
    }

    console.log('Connected to the MySQL server.');
  });




// const express = require("express");
// const app = express();
// const cors = require('cors');

// app.use(cors({
//     origin:'*'
// }));
// const mongoose = require("mongoose");

// // app.use(express.json());
// const uri = "mongodb+srv://boyubqn3:huce123@pkdt.zygktca.mongodb.net/?retryWrites=true&w=majority";

// async function connect() {
//     try {
//         await mongoose.connect(uri);
//         console.log("Connected to MongoDB");
//     } catch (error) {
//         console.error(error);
//     }
// }

// connect();

// const post_route = require('./routes/postRoute');
// app.use('/api',post_route);

// app.listen(8000, () => {
//     console.log("Server started on port 8000");
// });