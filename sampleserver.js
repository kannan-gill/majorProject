const express = require('express');
const pgp = require('pg-promise')(/* options */)

var cors = require('cors')


const app = express();
const port = 8080;
app.use(cors())

const Pool = require('pg').Pool
const pool = new Pool({
    user:'postgres',
    host:'localhost',
    database:'postgres',
    password:'postgres',
    port:'5432'
})

var arduinoAccepting=true;

app.get('/',(req,res)=>{
    pool.query('SELECT * FROM dataLogs2')
  .then((data) => {
    console.log(data.rows);
    res.json(data.rows); 
  })
  .catch((error) => {
    console.log('ERROR:', error)
  })
})

app.get('/arduinoData',(req,res)=>{
    var moisture = req.body.moisture;
    var temperature = req.body.temperature;
    pool.query("UPDATE dataLogs2 SET humidity = "+ moisture + ", temperature = "+temperature)
    .then((data)=>{
        console.log("moisture added");
    })
    arduinoAccepting = true;
    console.log("hello");
    res.send("haan bipin");
})

app.get("/arduinoAccepting",(req,res)=>{
    var mode = req.params.mode;
    if(mode ===1){
        arduinoAccepting = true;
    }
    else{
        arduinoAccepting = false;
    }
})

app.post('/thickness/:serialnumber/:thicknessvalue',(req,res)=>{
    var v1 = req.params.serialnumber;
    var v2 = req.params.thicknessvalue;

    pool.query("UPDATE dataLogs2 SET thickness = "+v2+" WHERE sno = "+v1)
    .then((data)=>{
        console.log("updated");
    })
    .catch((error)=>{
        console.log(error);
    })
})

function helper(serialNumberCurrent,dipspeed,retractspeed,delay,cycles){
    console.log(serialNumberCurrent);
   pool.query("INSERT INTO dataLogs2 (sno, datetime, dipspeed, retractspeed,numberofcycles,delaytime) VALUES  ("+ serialNumberCurrent+",now(),"+dipspeed+","+retractspeed+","+cycles+","+delay+ ")")
   .then((data)=>{
       console.log("new experiment added");
   })
}

app.post('/experiment/:dipspeed/:retractspeed/:delay/:cycles',(req,res)=>{
    var dipspeed = req.params.dipspeed;
    var retractspeed = req.params.retractspeed;
    var delay= req.params.delay;
    var cycles= req.params.cycles;

    const xhr5 = new XMLHttpRequest();

    if(arduinoAccepting){
        xhr5.open('get',"http://"+ arduinoIP+"/?dipSpeed="+dipspeed+"&retractSpeed="+retractspeed+"&delay="+delay+"&cycles="+cycles);
        xhr5.send();
        var numberOfExp;
        pool.query("SELECT * FROM dataLogs2")
        .then((data)=>{
            // console.log(data);
            numberOfExp = data.rowCount;
            helper(numberOfExp+1,dipspeed,retractspeed,delay,cycles);
        })
    }

    arduinoAccepting = false;

    

    
})

app.listen(port,()=>{
    console.log('listening');
})
