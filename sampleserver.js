const express = require('express');
const pgp = require('pg-promise')(/* options */)

var cors = require('cors')

const axios = require('axios')


const app = express();
const port = 8080;
app.use(cors())

app.use(express.json())

app.use(express.static('.'))

const Pool = require('pg').Pool
const pool = new Pool({
    // user:'postgres',
    // host:'localhost',
    // database:'postgres',
    // password:'postgres',
    // port:'5432'
    host:'ec2-54-165-90-230.compute-1.amazonaws.com',
    user:'vslxyyftaicmdf',
    database:'d719mg80gc8u09',
    password:'4f9d2b196b43c8d5dca5116f7ffcfddae6c18cac7fd26a0b6f9465fd078a7673',
    port:'5432'
})

// var arduinoAccepting=true;

app.get('/experimentalData',(req,res)=>{
    pool.query('SELECT * FROM dataLogs2;')
  .then((data) => {
    // console.log(data.rows);
    res.json(data.rows); 
  })
  .catch((error) => {
    console.log('ERROR:', error)
  })
})

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

app.post('/arduinoData',(req,res)=>{

    var dipSpeed = req.body.dipSpeed;
    var retractSpeed = req.body.retractSpeed;
    var delay= req.body.delay;
    var cycles= req.body.cycles;
    var distance= req.body.distance;

  var temperature = randomIntFromInterval(30,35);
  var humidity = randomIntFromInterval(45,50);
  var vibration = 'Normal';
  if(dipSpeed>10){
      vibration = "Excessive";
  }

    console.log(humidity,temperature,dipSpeed,retractSpeed,delay,cycles,distance,vibration);


    pool.query("INSERT INTO dataLogs2 (datetime, dipspeed, retractspeed,numberofcycles,delaytime,distance, humidity, temperature, vibration) VALUES  (now(),"+dipSpeed+","+retractSpeed+","+cycles+","+delay+","+distance+","+humidity+","+temperature+",'"+vibration+"');")
    .then((data)=>{
        console.log("new experiment added");
    })

    console.log("data received from arduino");
    res.send("Regards Server \n");
})


app.post('/thickness',(req,res)=>{
    console.log(req);
    var v1 = req.body.serialnumber;
    var v2 = req.body.thickness;
    console.log(v1,v2);

    pool.query("UPDATE dataLogs2 SET thickness = "+v2+" WHERE serialnumber = "+v1+";")
    .then((data)=>{
        console.log("updated");
    })
    .catch((error)=>{
        console.log(error);
    })
    res.send("updated");
})


app.post('/experiment',(req,res)=>{
    var dipspeed = req.body.dipspeed;
    var retractspeed = req.body.retractspeed;
    var delay= req.body.delay;
    var cycles= req.body.cycles;
    var distance= req.body.distance;
    if(dipspeed<15 && retractspeed<15 && distance<25 && cycles<20){
        const arduinoIP = "10.0.0.0";

        pool.query("INSERT INTO dataLogs2 (datetime, dipspeed, retractspeed,numberofcycles,delaytime,distance) VALUES  (now(),"+dipspeed+","+retractspeed+","+cycles+","+delay+","+distance+");")
        .then((data)=>{
            console.log("new experiment added");
        })

    //     axios.get("http://"+ arduinoIP+"/?sign=5001&dipSpeed="+dipspeed+"&retractSpeed="+retractspeed+"&delay="+delay+"&cycles="+cycles+"&distance="+distance)
    //    .then(resp => {
    //         console.log(resp.data);
    //     })
    //     .catch(error=>{
    //         console.log(error);
    //     })
    }

    res.send("Experiment data received, regards Server"); 
})

app.listen(process.env.PORT || port,()=>{
    console.log('listening');
})
