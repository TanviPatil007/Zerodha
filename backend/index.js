require('dotenv').config();
const express=require("express");
const mongoose=require("mongoose");
const bodyparser=require("body-parser");
const cors=require("cors");
const cookieParser = require("cookie-parser");
const authRoute = require("./Routes/AuthRoute");

const PORT =process.env.PORT || 4000;
const uri=process.env.MONGO_URL;
const { HoldingsModel }=require( "./Model/HoldingsModel" );
const { PositionsModel }= require("./Model/PositionsModel");
const { OrdersModel }=require("./Model/OrdersModel");

const app = express();
app.use(cors());
app.use(bodyparser.json());
// app.get("/addPositions",async(req , res) =>{
//      let tempPositions=[
//       {
//         product: "CNC",
//         name: "EVEREADY",
//         qty: 2,
//         avg: 316.27,
//         price: 312.35,
//         net: "+0.58%",
//         day: "-1.24%",
//         isLoss: true,
//       },
//       {
//         product: "CNC",
//         name: "JUBLFOOD",
//         qty: 1,
//         avg: 3124.75,
//         price: 3082.65,
//         net: "+10.04%",
//         day: "-1.35%",
//         isLoss: true,
//       },
//      ];
//      tempPositions.forEach((item)=>{
//             let newPosition=new PositionsModel({
//               product: item.product,
//               name: item.name,
//               qty: item.qty,
//               avg: item.avg,
//               price: item.price,
//               net: item.net,
//               day: item.day,
//               isLoss: item.isLoss,
//             });
//             newPosition.save();
//           });
//           res.send("done!");
// });


//  app.get("/addHoldings",async(req , res) =>{
//     let tempHoldings=[
//         {
//             name: "BHARTIARTL",
//             qty: 2,
//             avg: 538.05,
//             price: 541.15,
//             net: "+0.58%",
//             day: "+2.99%",
//           },
//           {
//             name: "HDFCBANK",
//             qty: 2,
//             avg: 1383.4,
//             price: 1522.35,
//             net: "+10.04%",
//             day: "+0.11%",
//           },
//           {
//             name: "HINDUNILVR",
//             qty: 1,
//             avg: 2335.85,
//             price: 2417.4,
//             net: "+3.49%",
//             day: "+0.21%",
//           },
//           {
//             name: "INFY",
//             qty: 1,
//             avg: 1350.5,
//             price: 1555.45,
//             net: "+15.18%",
//             day: "-1.60%",
          
//           },
//           {
//             name: "ITC",
//             qty: 5,
//             avg: 202.0,
//             price: 207.9,
//             net: "+2.92%",
//             day: "+0.80%",
//           },
//           {
//             name: "KPITTECH",
//             qty: 5,
//             avg: 250.3,
//             price: 266.45,
//             net: "+6.45%",
//             day: "+3.54%",
//           },
//           {
//             name: "M&M",
//             qty: 2,
//             avg: 809.9,
//             price: 779.8,
//             net: "-3.72%",
//             day: "-0.01%",
           
//           },
//     ];
//     tempHoldings.forEach((item)=>{
//       let newHolding=new HoldingsModel({
//         name: item.name,
//         qty: item.qty,
//         avg: item.avg,
//         price:item.price,
//         net: item.net,
//         day: item.day,
//       });
//       newHolding.save();
//     });
//     res.send("done!");

//  });

app.get('/allHoldings',async(req,res)=>{
   let allHoldings = await HoldingsModel.find({});
   res.json(allHoldings);
});
app.get('/allPositions',async(req,res)=>{
    let allPositions = await PositionsModel.find({});
    res.json(allPositions);
 });
app.get('/allOrders',async(req,res)=>{
    let allOrders = await OrdersModel.find({});
    res.json(allOrders);
 });
app.post('/newOrder',async(req,res)=>{
    let newOrder = new OrdersModel({
        name: req.body.name,
        qty: req.body.qty,
        price: req.body.price,
        mode: req.body.mode,
    });
    newOrder.save();
    res.send("done");
});
app.delete('/deleteOrder', async (req, res) => {
    try {
        const { name, qty, price } = req.body;

        // Find the order in the database
        const order = await OrdersModel.findOne({ name, qty, price, mode: "BUY" });

        if (!order) {
            return res.status(404).send("Order not found");
        }

        // Delete the order
        await OrdersModel.deleteOne({ _id: order._id });

        res.send("Order successfully deleted");
    } catch (error) {
        console.error("Error deleting order:", error);
        res.status(500).send("Error processing request");
    }
});


app.listen(PORT,()=>{
    console.log("app is listening on port 4000");
    mongoose.connect(uri);
    console.log("DB connected!");
});

app.use(
    cors({
      origin: ["http://localhost:4000"],
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    })
  );
  
app.use(cookieParser());

app.use(express.json());

app.use("/", authRoute);