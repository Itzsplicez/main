const express = require("express");
const fs = require("fs");

const app = express();

app.use(express.json());

app.use(express.static("public"));


const DB_PATH = "./users.json";



function readDB(){

    return JSON.parse(
        fs.readFileSync(DB_PATH)
    );

}



function writeDB(data){

    fs.writeFileSync(
        DB_PATH,
        JSON.stringify(data, null, 2)
    );

}



/* LOGIN */

app.post("/login",(req,res)=>{


    const { user, pass } = req.body;


    const db = readDB();



    if(db[user] && db[user].password === pass){


        res.json({

            success:true,

            user:user

        });


    }

    else{


        res.json({

            success:false

        });


    }


});






/* GET USER DATA */

app.get("/user/:name",(req,res)=>{


    const db = readDB();


    const user = db[req.params.name];



    if(!user){


        return res.status(404).json({

            error:"User not found"

        });


    }





    const startDate = new Date(
        user.serviceStarted
    );


    const expireDate = new Date(
        startDate
    );


    expireDate.setFullYear(
        expireDate.getFullYear() + 1
    );



    const today = new Date();



    const daysLeft = Math.max(

        0,

        Math.ceil(

            (expireDate - today) /

            (1000 * 60 * 60 * 24)

        )

    );





    res.json({


        domain:user.domain,


        storage:user.storage,


        uptime:user.uptime,


        status:user.status,


        health:user.health,


        serviceStarted:user.serviceStarted,


        daysLeft:daysLeft


    });



});









/* ADMIN UPDATE USER */

app.post("/admin/update",(req,res)=>{


    const {

        adminKey,

        user,

        data


    } = req.body;





    if(adminKey !== "fish"){


        return res.json({

            success:false,

            message:"No access"

        });


    }






    const db = readDB();





    if(!db[user]){


        return res.json({

            success:false,

            message:"User not found"

        });


    }






    db[user] = {


        ...db[user],


        ...data


    };






    writeDB(db);





    res.json({

        success:true

    });



});







app.listen(3000,()=>{


    console.log(
        "Hylex running on port 3000"
    );


});
