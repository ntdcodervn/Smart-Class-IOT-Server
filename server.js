const express = require('express');
const ConnectDB = require('./config/db');
const app = express();
const bodyParser = require('body-parser');
var Room = require('./model/Room');
const server = require('http').createServer(app);
const io = require('socket.io')(server);


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

const PORT = process.env.PORT || 4000 ;
server.listen(PORT, () => {console.log(`Server start on PORT ${PORT}`);
});

app.use('/', require('./routers/index'));
app.use('/api/teacher', require('./routers/api/teacher'));
app.use('/api/room', require('./routers/api/room'));
app.use('/api/class', require('./routers/api/class'));
app.use('/api/student', require('./routers/api/student'));



const changeStream = Room.watch();


// Listen event when collection room change any value
changeStream.on('change', async (next) => {
    const room = await Room.find({});
    console.log("Database đã thay đổi ");
    
    
       
    
   
    // emit room when change
     io.emit('changeRoom', room);
});

// Listen event connection from client
io.on('connection' , async (client) => {
    
    /* 
        @remode light by Room
        @data : {
             nameRoom (String),
            light1 (Boolean),
            light2 (Boolean),
            light3 (Boolean)
        }
    */
   client.emit('hello','ăn đấm không?');
    client.on('remode/light', async (data) => { 

         await Room.updateOne(
            {
                nameRoom : data.nameRoom , 
            },
            {
                light : {
                    light1 : data.light1,
                    light2 : data.light2,
                    light3 : data.light3
                },
            })
            console.log(data);
            
    }) 

     /* 
        @remode fan by Room
        @data : {
             nameRoom (String),
            fan1 (Boolean),
            fan2 (Boolean),
            fan3 (Boolean)
        }
    */
   client.on('remode/fan', async (data) => { 
    var room = await Room.updateOne(
        {
            nameRoom : data.nameRoom , 
        },
        {
            fan : {
                fan1 : data.fan1,
                fan2 : data.fan2,
                fan3 : data.fan3
            },
        })
        
    }) 

     /* 
        @remode fan by air_conditioner
        @data : {
             nameRoom (String),
            toggle (Boolean)
        }
    */
   client.on('remode/air_conditioner/toggle', async (data) => { 
    var room = await Room.updateOne(
        {
            nameRoom : data.nameRoom , 
        },
        {
            air_conditioner : {
                toggle : data.toggle,
                
            },
        })
    }) 

    /* 
        @remode fan by air_conditioner
        @data : {
            nameRoom (String),
            temperature (Integer)
        }
    */
   client.on('remode/air_conditioner/temperature', async (data) => { 
    var room = await Room.updateOne(
        {
            nameRoom : data.nameRoom , 
        },
        {
            air_conditioner : {
                temperature : data.temperature,
                
            },
        })
    }) 

    /* 
        @remode fan by air_conditioner
        @data : {
            nameRoom (String),
            toggle (Boolean),
            temperature(Integer)
        }
    */
   client.on('remode/air_conditioner/temperature', async (data) => { 
    var room = await Room.updateOne(
        {
            nameRoom : data.nameRoom , 
        },
        {
            air_conditioner : {
                toggle : data.toggle,
                temperature : data.temperature,
            },
        })
    }) 
    
    console.log('Connect DB');
    
    
})





ConnectDB();




   
    

    
        
 