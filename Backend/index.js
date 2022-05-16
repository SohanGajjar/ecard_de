const mongoose = require("mongoose");
mongoose.connect(
  "mongodb://localhost:27017/",
  {
    dbName: "e_card",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) =>
    err ? console.log(err) : console.log("Connected to students database")
);

const StudentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  balance: {
    type : Number,
    required: true,
    default: 0,
  }
});
const Student = mongoose.model("students", StudentSchema);
Student.createIndexes();

// For backend and express
const express = require("express");
const app = express();
const cors = require("cors");
console.log("App listen at port 5000");
app.use(express.json());
app.use(cors());
app.get("/", (req, resp) => {
  resp.send("App is Working");
  // You can check backend is working or not by
  // entering http://loacalhost:5000

  // If you see App is working means
  // backend working properly
});

app.get("/allusers", async (req, res) => {
  try {
    const data = await Student.find();
    res.send(data);
    // res.send(res)
  } catch (e) {
    res.send("error");
  }
});

// app.post("/update", async (req, res) => {
//   try {
//     User.updateOne({name : req.body.name1}, 
//       {name : req.body.name2}, function (err, docs) {
//       if (err){
//           console.log(err)
//       }
//       else{
//           console.log("Updated Docs : ", docs);
//       }
//   });
//     console.log(req.body)
//   } catch (e) {
//     res.send("Something Went Wrong");
//   }
// });

app.post("/transaction", async (req, res) => {
  try {
    Student.updateOne({name: req.body.name}, 
      {balance : req.body.balance}, function (err, docs) {
      if (err){
          console.log(err)
      }
      else{
          console.log("Updated Docs : ", docs);
          res.send(req.body);
      }
  });
  
  } catch (e) {
    res.send("Something Went Wrong");
  }
});


app.post("/register", async (req, res) => {
  try {
    const student = new Student(req.body);
    let result = await student.save();
    result = result.toObject();
    if (result) {
      delete result.password;
      res.send(req.body);
      console.log(result);
    } else {
      console.log("Student already register");
    }
  } catch (e) {
    res.send("Something Went Wrong");
  }
});
app.listen(5000);
