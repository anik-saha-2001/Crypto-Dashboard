const express = require("express");
const app = express();
const port = 3000;
var request = require("request");
var multer = require("multer");
var upload = multer();

//Using Body Parser
const bodyParser = require("body-parser");
app.use(bodyParser.json()); //for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));

//Using Multer
app.use(upload.array());

//Using Static Files
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");


let mData = "";
let coinName = "bitcoin";
let mChart = "";

async function resData(coinName){
    var marketData = await new Promise((resolve, reject)=>{
        //Using Request
        request("https://api.coingecko.com/api/v3/coins/" + coinName, function(error, response, body){
            console.error("error:", error);
            console.log("statuscode: ", response && response.statusCode);
            console.log("body:", typeof body);
            mData = JSON.parse(body);
        resolve(mData);
        });
    });

    if(marketData){
    var marketChart = await new Promise((resolve, reject)=>{
        //Using Request
        request("https://api.coingecko.com/api/v3/coins/"+ coinName +"/market_chart?vs_currency=usd&days=30", function(error, response, body){
            console.error("error:", error);
            console.log("statuscode: ", response && response.statusCode);
            console.log("body:", typeof body);
            mChart = JSON.parse(body);
            // console.log(mChart);
        resolve(mChart);
        });
    });
    }


}


app.get("/", async function(req, res){
    await resData(coinName);
    res.render("index", {mData, mChart});
});


app.post("/", async function(req, res){
    coinName = req.body.selectCoin;
    await resData(coinName);
    res.render("index", {mData, mChart});
});


app.listen(port, function(){
    console.log(`Example app listening on port http://localhost:${port}`);
});