const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const cors = require('cors')
var mongo = require('mongodb');
const mongoose = require('mongoose')
require('dotenv').config()

mongoose.connect(process.env.aa,{useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connection.on('connected', function(){  
    console.log("Mongoose default connection is open to ", process.env.aa);
 });
app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.use(express.static('public'))

const eSchema = new mongoose.Schema({
	username:{type:String,required:true},
	
})
var userex=mongoose.model("Userex",eSchema)

const exercSchema = new mongoose.Schema({
	username:{type:String,required:true},
	description: String,
	duration: Number,
	date: Date
})

var exercise=mongoose.model("Exercise",exercSchema)

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/exercise/new-user',function(req, res){
	console.log(req.body.username)
	var ue=new userex({
		username: req.body.username
	})
	//console.log(ue)
	ue.save(function(err,data){
		if(err){
			console.log(err)
			return(err)
		}
		console.log(data)
		res.send(data)
	})
	
	
})


app.post('/api/exercise/add',function(req,res){
	var ex=new exercise({
		username: req.body.userId,
		description: req.body.description,
		duration: req.body.duration,
		date: req.body.date
	})
	//console.log(ue)
	ex.save(function(err,data){
		if(err){
			console.log(err)
			return(err)
		}
		console.log(data)
		res.send(data)
	})
	
		
})


app.get('/api/exercise/log',function(req,res){
	var from = req.query.from
	var to = req.query.to
	var limit = req.query.limit
	var query={
		username:req.query.userId
	}
	if(from !== undefined)
		query.date={$gte:from}
	
	
	if(to !== undefined)
		query.date={$lt:to}
	
	
	exercise.find(query).exec(function(err,data){
		if(err){
			return(err)
		
		}
		res.send(data)
	})
})

// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
})

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
