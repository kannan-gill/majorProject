const express = require('express');
const pgp = require('pg-promise')(/* options */)






var cors = require('cors')

const axios = require('axios')


const app = express();
const port = 8080;
app.use(cors())

app.use(express.json())

const Pool = require('pg').Pool
const pool = new Pool({
    user:'postgres',
    host:'localhost',
    database:'postgres',
    password:'postgres',
    port:'5432'
})

// var arduinoAccepting=true;

app.get('/',(req,res)=>{
    pool.query('SELECT * FROM dataLogs2')
  .then((data) => {
    // console.log(data.rows);
    res.json(data.rows); 
  })
  .catch((error) => {
    console.log('ERROR:', error)
  })
})

app.post('/arduinoData',(req,res)=>{

    console.log(req);
    var humidity = req.body.humidity;
    var temperature = req.body.temperature;
    var dipSpeed = req.body.dipSpeed;
    var retractSpeed = req.body.retractSpeed;
    var delay= req.body.delay;
    var cycles= req.body.cycles;
    var distance= req.body.distance;
    var vibration = req.body.vibration;

    console.log(humidity,temperature,dipSpeed,retractSpeed,delay,cycles,distance,vibration);

    // var numberOfExp;
    // pool.query("SELECT * FROM dataLogs2")
    // .then((data)=>{
    //     numberOfExp = data.rowCount+1;
    // })

    pool.query("INSERT INTO dataLogs2 (datetime, dipspeed, retractspeed,numberofcycles,delaytime,distance, humidity, temperature, vibration) VALUES  (now(),"+dipSpeed+","+retractSpeed+","+cycles+","+delay+","+distance+","+humidity+","+temperature+","+vibration+")")
    .then((data)=>{
        console.log("new experiment added");
    })
    
    // pool.query("UPDATE dataLogs2 SET humidity = "+ humidity + ", temperature = "+temperature+" where serialnumber = "+numberOfExp)
    // .then((data)=>{
    //     console.log("moisture added");
    // })
    //arduinoAccepting = true;
    console.log("data received from arduino");
    res.send("Regards Server \n");
})

// app.get("/arduinoAccepting",(req,res)=>{
//     var mode = req.params.mode;
//     if(mode ===1){
//         arduinoAccepting = true;
//     }
//     else{
//         arduinoAccepting = false;
//     }
// })

app.post('/thickness',(req,res)=>{
    console.log(req);
    var v1 = req.body.serialnumber;
    var v2 = req.body.thickness;
    console.log(v1,v2);

    pool.query("UPDATE dataLogs2 SET thickness = "+v2+" WHERE serialnumber = "+v1)
    .then((data)=>{
        console.log("updated");
    })
    .catch((error)=>{
        console.log(error);
    })
})

// function helper(serialNumberCurrent,dipspeed,retractspeed,delay,cycles,distance){
//    pool.query("INSERT INTO dataLogs2 (sno, datetime, dipspeed, retractspeed,numberofcycles,delaytime,distance) VALUES  ("+ serialNumberCurrent+",now(),"+dipspeed+","+retractspeed+","+cycles+","+delay+","+distance+")")
//    .then((data)=>{
//        console.log("new experiment added");
//    })
// }


app.post('/experiment',(req,res)=>{
    var dipspeed = req.body.dipspeed;
    var retractspeed = req.body.retractspeed;
    var delay= req.body.delay;
    var cycles= req.body.cycles;
    var distance= req.body.distance;


    

    // if(arduinoAccepting){
       // xhr5.open('get',"http://"+ arduinoIP+"/?dipSpeed="+dipspeed+"&retractSpeed="+retractspeed+"&delay="+delay+"&cycles="+cycles);
       // xhr5.send();


       const arduinoIP = "10.0.0.0";

        axios.get("http://"+ arduinoIP+"/?sign=5001&dipSpeed="+dipspeed+"&retractSpeed="+retractspeed+"&delay="+delay+"&cycles="+cycles+"&distance="+distance)
    // axios.get("https://reqbin.com/echo/get/json")
       .then(resp => {
            console.log(resp.data);
        })
        .catch(error=>{
            console.log(error);
        })

    // axios.get("https://reqbin.com/echo/get/json")
    // .then(resp=>console.log(resp))
    // .catch(error=>console.log(error));

        // var numberOfExp;
        // pool.query("SELECT * FROM dataLogs2")
        // .then((data)=>{
        //     numberOfExp = data.rowCount;
        //     helper(numberOfExp+1,dipspeed,retractspeed,delay,cycles,distance);
        // })

        // pool.query("INSERT INTO dataLogs2 (datetime, dipspeed, retractspeed,numberofcycles,delaytime,distance) VALUES  (now(),"+dipspeed+","+retractspeed+","+cycles+","+delay+","+distance+")")
        // .then((data)=>{
        //     console.log("new experiment added");
        // })


    // }

    // arduinoAccepting = false;

    

    
})

app.listen(port,()=>{
    console.log('listening');
})
