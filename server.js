'use strict';
const express = require('express');
require ('dotenv').config();
const cors=require('cors');
const axios =require('axios');
const app = express();
app.use(express.json());
app.use(cors());
const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/DB_NAME',{ useNewUrlParser: true, useUnifiedTopology: true });
const PORT=process.env.PORT;
const thecocktailSchema = new mongoose.Schema({
    strDrink:String,
    strDrinkThumb:String
});
const thecocktailModel = mongoose.model('drink',thecocktailSchema);
 app.get('/',allData);

 app.post('/addTofav',addToFav);
 app.get('/getFav',getFav);
 app.delete('/deletefav',deleteFav);
 app.put('/updateFav',updateFav);

const apiUrl=`https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic`;
 function allData(req,res){
     axios.get(apiUrl).then(apiData=>{
         res.send(apiData.data.drinks);
     });
     
 }
 function addToFav(req,res){
     const{strDrink,strDrinkThumb}=req.body;
     const item=new thecocktailModel({
        strDrink:strDrink,
        strDrinkThumb:strDrinkThumb,
     })
     item.save();
 }
 
 function getFav(req,res){
    thecocktailModel.find({},(err,data)=>{
        res.send(data);
    })
 }

 function deleteFav(req,res){
     const id=req.query.id;
     thecocktailModel.deleteOne({_id:id},(err,data)=>{
        thecocktailModel.find({},(err,data)=>{
            res.send(data);
        })
     })
 }

 function updateFav(req,res){
     const {strDrink,strDrinkThumb,id}=req.body;
     thecocktailModel.find({_id:id},(err,data)=>{
         data[0].strDrink=strDrink;
         data[0].strDrinkThumb=strDrinkThumb;
         data[0].save().then(()=>{
            thecocktailModel.find({},(err,data)=>{
                res.send(data);
            })
         })
     })
 }
 app.listen(process.env.PORT);