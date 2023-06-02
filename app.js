const express = require("express");
const mongo = require("mongodb");
const MongoClient = mongo.MongoClient;
const bodyParser = require("body-parser");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT || 5000;
var cors = require("cors");
app.use(cors());
// var cors = require('cors');
// app.use((cors));



//middleware
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
// console.log(process.env.PORT);
// console.log(process.env);

const MONGO_URL = process.env.MONGO_URL;
//"mongodb://127.0.0.1:27017"



const location = [
    {
      "location_id": 1,
      "location_name": "Ashok Vihar Phase 3, New Delhi",
      "state_id": 1,
      "state": "Delhi",
      "country_name": "India"
    },
    {
      "location_id": 2,
      "location_name": "Ashok Vihar Phase 2,Chincholi, Delhi-110006, Delhi",
      "state_id": 1,
      "state": "Delhi",
      "country_name": "India"
    },
    {
      "location_id": 3,
      "location_name": "Tagore Garden, New Delhi",
      "state_id": 1,
      "state": "Delhi",
      "country_name": "India"
    },
    {
      "location_id": 4,
      "location_name": "Bibvewadi, Pune",
      "state_id": 2,
      "state": "Maharashtra",
      "country_name": "India"
    },
    {
      "location_id": 5,
      "location_name": "Hadapsar, Pune",
      "state_id": 2,
      "state": "Maharashtra",
      "country_name": "India"
    },
    {
      "location_id": 6,
      "location_name": "Kothrud, Pune",
      "state_id": 2,
      "state": "Maharashtra",
      "country_name": "India"
    },
    {
      "location_id": 7,
      "location_name": "Anand Vihar",
      "state_id": 1,
      "state": "Delhi",
      "country_name": "India"
    },
    {
      "location_id": 8,
      "location_name": "Jeevan Bhima Nagar, Bangalore",
      "state_id": 3,
      "state": "Karnataka",
      "country_name": "India"
    },
    {
      "location_id": 9,
      "location_name": "Rajajinagar, Bangalore-430006, Bangalore",
      "state_id": 3,
      "state": "Karnataka",
      "country_name": "India"
    },
    {
      "location_id": 10,
      "location_name": "HSR, Bangalore",
      "state_id": 3,
      "state": "Karnataka",
      "country_name": "India"
    },
    {
      "location_id": 11,
      "location_name": "Thane, Mumbai",
      "state_id": 2,
      "state": "Maharashtra",
      "country_name": "India"
    },
    {
      "location_id": 12,
      "location_name": "Borivali West, Mumbai",
      "state_id": 2,
      "state": "Maharashtra",
      "country_name": "India"
    },
    {
      "location_id": 13,
      "location_name": "Sector 40, Chandigarh",
      "state_id": 4,
      "state": "Punjab",
      "country_name": "India"
    },
    {
      "location_id": 14,
      "location_name": "Majnu ka Tila, New Delhi",
      "state_id": 1,
      "state": "Delhi",
      "country_name": "India"
    }
  ]
//Rest api end-points
app.get('/', function (req, res) {
  res.send('Hello Everyone')
})
//get locations from database
app.get("/locations", function (req, res) {
  db.collection("location").find().toArray((err,result)=>{
    if(err) throw err;
    res.send(result);
  });
  
});

//get quick search details
app.get("/quickSearch", function (req, res) {
  db.collection("mealType").find().toArray((err,result)=>{
    if(err) throw err;
    res.send(result);
  });
  
});

//get resturants from db as per state id or meal id
app.get("/resturant", function (req, res) {
    let query = {};
    let stateId =Number(req.query.stateId);
    let mealId =Number(req.query.mealId);
    if(stateId){
      query={ state_id:stateId };
    }else if(mealId){
      query ={ "mealTypes.mealtype_id":mealId}
    }

  db.collection("zomato").find(query).toArray((err,result)=>{
    if(err) throw err;
    res.send(result);
  });
  
});
//filter resturants as per cuisine , costs and low to high and vice versa
app.get("/filter/:mealId", function (req, res) {
  let query = {};
  let sort = {cost:1};
  let mealId = Number(req.params.mealId);
  let cuisineId = Number(req.query.cuisineId);
  let lcost = Number(req.query.lcost);
  let hcost = Number(req.query.hcost);
  if(req.query.sort){
    sort = {cost:req.query.sort};
  }

  if(cuisineId){
    query = {
      "mealTypes.mealtype_id":mealId,
      "cuisines.cuisine_id" : cuisineId
    };
  }else if(lcost && hcost){
    query={
      "mealTypes.mealtype_id":mealId,
      $and:[{cost:{$gt:lcost , $lt:hcost}}]
      // $and:[{cost:{$gt:lcost }}, {cost:{$lt:hcost }}]
  };
}else if(cuisineId && lcost && hcost ){
  query={
    "mealTypes.mealtype_id":mealId,
     "cuisines.cuisine_id" : cuisineId,
     $and:[{cost:{$gt:lcost , $lt:hcost}}]
    // $and:[{cost:{$gt:lcost }}, {cost:{$lt:hcost }} , {"cuisines.cuisine_id":cuisineId}]
  };
}else{
  query = {
    "mealTypes.mealtype_id":mealId
  }
}
db.collection("zomato").find(query).sort(sort).toArray((err,result)=>{
    if(err) throw err;
    res.send(result);
  });
  
});

//list of meals 
app.get("/menu/:id", function (req, res) {
  let id = Number(req.params.id);
  db.collection("menu").find({restaurant_id:id}).toArray((err,result)=>{
    if(err) throw err;
    res.send(result);
  });
  
});

//resturant details
app.get("/details/:id", function (req, res) {
  // let id = mongo.ObjectId(req.params.id);
  let id = Number(req.params.id);
  db.collection("zomato").find({restaurant_id:id}).toArray((err,result)=>{
    if(err) throw err;
    res.send(result);
  });
});

app.post("/menuItem" , function(req , res){
  // console.log(req.body);
  if(Array.isArray(req.body)){
    db.collection('menu').find({menu_id:{$in:req.body}}).toArray((err,result)=>{
      if(err) throw err;
      res.send(result);
    })
  }else{
    res.send('invalid input');
  }
})

//placeorder
app.post("/placeorder" , function(req , res){
  // console.log(req.body)
  db.collection('orders').insertOne(req.body,(err , result)=>{
      if(err) throw err;
      res.send('order has been placed');
    });
  });

//list of orders
  app.get("/orders" , function(req , res){
    let query = {};
    email = req.query.email;
    if(email){
      query={email};
    }
    db.collection("orders").find(query).toArray((err,result)=>{
      if(err) throw err;
      res.send(result);
    });
  });

  //delete orders

  app.delete("/deleteOrders/:id" , function(req , res){
    let _id = mongo.ObjectId(req.params.id);
    db.collection("orders").deleteOne({_id} , (err,result)=>{
      if(err) throw err;
      res.send('Order deleted successfully');
    });
  });
//update orders
  app.put("/updateOrders/:id" , function(req , res){
    let oid = Number(req.params.id);
    db.collection("orders").updateOne({orderId : oid} , {$set:{
      "status" : req.body.status,
      "bank_name":req.body.bank_name,
      "date":req.body.date
    }} , (err,result)=>{
      if(err) throw err;
      res.send('Order updated successfully');
    });
  });









//mongodb connection
MongoClient.connect(MONGO_URL, (err, client) => {
  console.log("Mongo is connected");
  if (err) console.log("Error while connecting");
  db = client.db("ed73we");
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
});
  

