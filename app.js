const express = require('express');
const app = express();
var mongoose = require("mongoose");
var User = require('./dbschema');

var parOwner = require("./parSchema");
var Parking = require("./parInfo");

var warOwner = require("./warOwnerSchema");
var Workshop = require("./warInfoSchema");

var hosOwner = require("./hosOwnerSchema");
var Hospital = require("./hosInfoSchema");

var foodOwner = require("./foodOwnerSchema");
var Food = require("./foodInfoSchema");
var ObjectId = require('mongodb').ObjectID;
mongoose.connect("mongodb://localhost/LoginDb");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({accessToken:'pk.eyJ1IjoiYWphamF5IiwiYSI6ImNrNDJ4MnVndDAxcnkzbmxrZzByZHk4bmMifQ.hM2FfZFemgQWN3NUy67K5w'});

// var NodeGeocoder = require('node-geocoder');
 
// var options = {
//   provider: 'google',
//   httpAdapter: 'https',
//   apiKey: process.env.GEOCODER_API_KEY,
//   formatter: null
// };
 
app.use(express.json());

app.post('/signup', (req, res) => {
    const newUser = {
        name: req.body.uname,
        email: req.body.email,
        number:req.body.num,
        password: req.body.pass
    }
    User.create(newUser,function(err,user){
        if(err){
            console.log(err);
            res.status(400).send();
        }else{
            console.log(user);
            res.status(200).send();
        }
    });
});

app.post('/login', (req, res) => {
    const query = {
         email: req.body.email, 
         password: req.body.password
    }
 User.findOne(query,function(err,foundUser){
        if(err){
            console.log(err);
            res.status(400).send();
        }else{
            if(foundUser!=null){
                const objToSend={
                    name:foundUser.name,
                    email:foundUser.email,
                    id:foundUser._id
                }
                console.log(objToSend);
                res.status(200).send(JSON.stringify(objToSend));
            }else{
                res.status(404).send();
            }
        }
    });
});

app.post("/par_login",function(req,res){
     const query = {
         email: req.body.email, 
         password: req.body.password
    }
    parOwner.findOne(query,function(err,foundUser){
        if(err){
            console.log(err);
            res.status(400).send();
        }else{
            if(foundUser!=null){
                const objToSend={
                    name:foundUser.name,
                    email:foundUser.email,
                    id:foundUser._id
                }
                console.log(objToSend);
                res.status(200).send(JSON.stringify(objToSend));
            }else{
                res.status(404).send();
            }
        }
    });
});

app.post("/par_signup",(req,res)=>{
    console.log("hey");
    const query={
        name:req.body.uname,
        email:req.body.email,
        pname:req.body.pname,
        slots:req.body.slots,
        loc:req.body.loc,
        mno:req.body.mno,
        password:req.body.pass,
        price:req.body.price
    }
    var location=req.body.loc;
    geocoder(location,function(n){

      parOwner.create(query,function(err,Owner){
        if(err){
            console.log(err);
            res.status(400).send();
        }else{
            Owner.coordinates.push(n[0]);
            Owner.coordinates.push(n[1]);
            Owner.save();
            const an={
                name:req.body.pname,
                loc:req.body.loc,
                mno:req.body.mno,
                slots:req.body.slots,
                coordinates:Owner.coordinates,
                price:req.body.price
            }
            Parking.create(an,function(err,ParkS){
                if(err){
                    console.log(err);
                    res.status(400).send();
                }else{
                    console.log(ParkS);
                    res.status(200).send();
                }
            });
        }
    });
  });
});

async function geocoder(location,callback){
 try{
 let response = await geocodingClient
   .forwardGeocode({
    query:location,
    limit:1
   })
   .send()
  console.log(response.body.features[0].geometry.coordinates);
 var n=response.body.features[0].geometry.coordinates;
 callback(n);
}catch(err){
    console.log("sv");
  console.log(err.message);
} 
}
app.post("/fetch",(req,res)=>{
    if(req.body.token === "user"){
    User.findById(req.body.id,function(err,foundUser){
        if(err){
            console.log(err);
            res.status(400).send();
        }else{
            if(foundUser!=null){
                const toSend={
                    name:foundUser.name,
                    email:foundUser.email
                }
                console.log(toSend);
                res.status(200).send(JSON.stringify(toSend));
            }else{
                res.status(404).send();
            }
        }
    });
    }else{
        parOwner.findById(req.body.id,function(err,foundUser){
        if(err){
            console.log(err);
            res.status(400).send();
        }else{
            if(foundUser!=null){
                const toSend={
                    name:foundUser.name,
                    email:foundUser.email
                }
                console.log(toSend);
                res.status(200).send(JSON.stringify(toSend));
            }else{
                res.status(404).send();
            }
        }
    });
    }
});

app.get("/newPar",(req,res)=>{
    const dd={
        name:"KUMAR"
    }
    Parking.create(dd,function(err,newPar){
        if(err){
            console.log(err);
        }else{
            console.log("Added");
            console.log(newPar);
        }
    });

});

app.post("/getAllPar",function(req,res){
    // console.log(req.body.id);
    Parking.find({},function(err,allPar){
        if(err){
            console.log(err);
             res.status(400).send();
        }else{
           var obj=[];
           var loc=[];
           var slots=[];var mno=[];var coordinates=[];
           var price=[];
           allPar.forEach(function(i){

            obj.push(i.name);
            loc.push(i.loc);
            slots.push(i.slots);
            mno.push(i.mno);
            coordinates.push(i.coordinates[0]);
            coordinates.push(i.coordinates[1]);
            price.push(i.price);
           });
           // console.log(obj);
            const ob ={
                objs:obj,
                loc:loc,
                slots:slots,
                mno:mno,
                coordinates:coordinates,
                price:price
            }
            console.log(ob);
            res.status(200).send(JSON.stringify(ob));
        }
    });
});
app.post("/getAllLocs",function(req,res){
    Parking.find({},function(err,allLocs){
        if(err){
            console.log(err);
             res.status(400).send();

        }else{
            var loc=[];
            var names=[];
            var slots=[];
            var mno=[];
            var price=[];
            var ide=[];
            allLocs.forEach(function(i){
              if(i.coordinates[0]!=-1){
                loc.push((i.coordinates[0]).toString());
                loc.push((i.coordinates[1]).toString());
                names.push(i.name);
                slots.push(i.slots);
                mno.push(i.mno);
                price.push(i.price);
                ide.push("parking");
            }
            });
            var oloc=[];
            var onames=[];
            var omno=[];
            Food.find({},function(err,allFoods){
                if(err){
                    console.log(err);
                }else{
                    allFoods.forEach(function(i){
                        oloc.push((i.coordinates[0]).toString());
                        oloc.push((i.coordinates[1]).toString());
                        onames.push(i.name);
                        omno.push(i.mno);
                        ide.push("food");
                    });
                    Workshop.find({},function(err,allWorks){
                        if(err){
                            console.log(err);
                        }else{
                            allWorks.forEach(function(i){
                                oloc.push((i.coordinates[0]).toString());
                                oloc.push((i.coordinates[1]).toString());
                                onames.push(i.name);
                                omno.push(i.mno);
                                ide.push("Workshop");
                            });
                            Hospital.find({},function(err,allHos){
                                if(err){
                                    console.log(err);
                                }else{
                                    allHos.forEach(function(i){
                                     oloc.push((i.coordinates[0]).toString());
                                     oloc.push((i.coordinates[1]).toString());
                                    onames.push(i.name);
                                    omno.push(i.mno);
                                    ide.push("hospital");
                                     });
                                       const ob={
                                             locs:loc,
                                             names:names,
                                             mno:mno,
                                             prices:price,
                                             slots:slots,
                                             oloc:oloc,
                                             onames:onames,
                                             omno:omno,
                                             ide:ide
                                        }
                                       console.log(ob);
                                        res.status(200).send(JSON.stringify(ob));                                    
                                }
                            });

                        }
                    });
                }
            })
          
        }
    });
});
app.post("/getADetails",function(req,res){
    Parking.findOne({name:req.body.pname},function(err,gotDetails){
        if(err){
            console.log(err);
            res.status(400).send();
        }else{
            const ob={
                pName:gotDetails.name,
                Loc:gotDetails.loc,
                slots:gotDetails.slots,
                mno:gotDetails.mno,
                price:gotDetails.price,
                coordinate1:gotDetails.coordinates[0],
                coordinate2:gotDetails.coordinates[1]
            }
           res.status(200).send(JSON.stringify(ob));

        }
    });
});

app.post("/bookAParking",function(req,res){
    console.log("got");
    Parking.findOne({name:req.body.pname},function(err,gotPark){
        if(err){
            console.log(err);
            res.status(400).send();
        }else{
            var p=Number(req.body.hours)*Number(gotPark.price);
            var y=(Number(gotPark.slots)-1)+'';
            gotPark.slots=y;
            gotPark.save();
           
            User.findById(req.body.id,function(err,foundUser){
                if(err){
                    console.log(err);
                    res.status(400).send();
                }else{
                     var x={"id":gotPark._id,pname:gotPark.name,loc:gotPark.loc,hours:req.body.hours,price:p+'',
            mno:gotPark.mno,coordinates:gotPark.coordinates,cname:foundUser.name,cno:foundUser.number};
                    foundUser.book.push(x);
                    foundUser.save();
                    parOwner.findOne({pname:req.body.pname},function(err,foundOwn){
                        if(err){
                            console.log(err);
                        }else{
                            foundOwn.customers.push(x);
                            foundOwn.save();
                             res.status(200).send();
                        }
                    });
                     
                }
            });
        }
    });
});

app.post("/getAllBook",function(req,res){
    console.log("came");
    User.findById(req.body.id,function(err,foundUser){
        if(err){
            console.log(err);
            res.status(400).send();
        }else{
            var placeName=[];
            var location=[];
            var placePrice=[];
            var placeHours=[];
            foundUser.book.forEach(function(i){
                placeName.push(i.pname);
                location.push(i.loc);
                placePrice.push(i.price);
                placeHours.push(i.hours);
            });

            const ob={
                name:placeName,
                loc:location,
                price:placePrice,
                hrs:placeHours
            }
            console.log(ob);
            res.status(200).send(JSON.stringify(ob));
        }
    });
});

app.post("/getparorderdet",function(req,res){
    console.log("came Here");
    User.findById(req.body.id,function(err,foundUser){
            if(err){
                console.log(err);
                res.status(400).send();
            }else{
                var name =req.body.pname;
                var idx=0;
                var i=0;
                for( i=0;i<foundUser.book.length;i++){
                    if(foundUser.book[i].pname===name){
                        break;
                    }
                }
                const ob={
                pName:foundUser.book[i].pname,
                Loc:foundUser.book[i].loc,
                hours:foundUser.book[i].hours,
                mno:foundUser.book[i].mno,
                price:foundUser.book[i].price,
                coordinate1:foundUser.book[i].coordinates[0],
                coordinate2:foundUser.book[i].coordinates[1]

                }
                console.log(ob);
            res.status(200).send(JSON.stringify(ob));
            }
        });
});
app.post("/getClientDetails",function(req,res){
    parOwner.findById(req.body.id,function(err,foundOwn){
        if(err){
             console.log(err);
            res.status(400).send();
        }else{
            var cname = req.body.cname;
            var i=0;
            for(i=0;i<foundOwn.customers.length;i++){
                if(foundOwn.customers[i].cname===cname){
                    break;
                }
            }
            const ob={
                pName:foundOwn.customers[i].pname,
                Loc:foundOwn.customers[i].loc,
                hours:foundOwn.customers[i].hours,
                price:foundOwn.customers[i].price,
                cName:foundOwn.customers[i].cname,
                cMno:foundOwn.customers[i].cno,
            }
              console.log(ob);
            res.status(200).send(JSON.stringify(ob));
        }
    });
});
app.post("/getAllClients",function(req,res){
    console.log("came here to fetch clients");
    parOwner.findById(req.body.id,function(err,foundOwn){
        if(err){
             console.log(err);
                res.status(400).send();
            }else{
                var clientNames=[];
                var clientNos =[];
                var clientHrs=[];
                var clientPrice=[];
                foundOwn.customers.forEach(function(i){
                    clientNames.push(i.cname);
                    clientNos.push(i.cno);
                    clientHrs.push(i.hours);
                    clientPrice.push(i.price);
                });
                const ob={
                    cname:clientNames,
                    cno:clientNos,
                    chrs:clientHrs,
                    cprice:clientPrice
                }
                     console.log(ob);
            res.status(200).send(JSON.stringify(ob));
            }
    });
});
app.post("/cancelbook",function(req,res){
    User.findById(req.body.id,function(err,foundUser){
        if(err){
            console.log(err);
            res.status(400).send();
        }else{
          parOwner.findOne({pname:req.body.pname},function(err,foundOwn){
            if(err){
                console.log(err);
                res.status(400).send();
            }else{
      
            var name = req.body.pname;
            var i=0;
            for(i=0;i<foundUser.book.length;i++){
                if(foundUser.book[i].pname==name){
                    break;
                }
            }
            var j=0;
            for(j=0;j<foundOwn.customers.length;j++){
                if(foundOwn.customers[j].pname==name){
                    break;
                }
            }
            foundUser.book.splice(i,1);
            foundUser.save();
            foundOwn.customers.splice(j,1);
            foundOwn.save();
            Parking.findOne({name:name},function(err,foundPar){
                if(err){
                    console.log(err);
                    res.status(400).send();
                }else{
                    foundPar.slots=(Number(foundPar.slots)+1)+'';
                    foundPar.save();
                    res.status(200).send();
                }
            });
             }
        });
        }
    });
});
app.post("/force_cancel_book",function(req,res){
    parOwner.findById(req.body.id,function(err,foundOwn){
        if(err){
            console.log(err);
            res.status(400).send();
        }else{
            var cname = req.body.cname;
            User.findOne({name:cname},function(err,foundUser){
                if(err){
                     console.log(err);
                    res.status(400).send();
                }else{
                    var i=0;
                    for(i=0;i<foundOwn.customers.length;i++){
                        if(foundOwn.customers[i].cname===cname){
                            break;
                        }
                    }
                    var pname = foundOwn.customers[i].pname;
                    var j=0;
                    for(j=0;j<foundUser.book.length;i++){
                        if(foundUser.book[i].pname===pname){
                            break;
                        }
                    }
                    foundOwn.customers.splice(i,1);
                    foundOwn.save();
                    foundUser.book.splice(j,1);
                    foundUser.save();
                     Parking.findOne({name:pname},function(err,foundPar){
                        if(err){
                            console.log(err);
                            res.status(400).send();
                        }else{
                            foundPar.slots=(Number(foundPar.slots)+1)+'';
                            foundPar.save();
                            res.status(200).send();
                        }
                    });
                }
            });
            
        }
    });
});
app.post("/ws_signup",function(req,res){
     const query={
        name:req.body.uname,
        email:req.body.email,
        pname:req.body.pname,
        loc:req.body.loc,
        mno:req.body.mno,
        password:req.body.password,
    }
    var location=req.body.loc;
    geocoder(location,function(n){

      warOwner.create(query,function(err,Owner){
        if(err){
            console.log(err);
            res.status(400).send();
        }else{
             Owner.coordinates.push(n[0]);
            Owner.coordinates.push(n[1]);
            Owner.save();
            const an={
                name:req.body.pname,
                loc:req.body.loc,
                mno:req.body.mno,
                coordinates:Owner.coordinates,

            }
            Workshop.create(an,function(err,ws){
                if(err){
                    console.log(err);
                    res.status(400).send();
                }else{
                    console.log(ws);
                    res.status(200).send();
                }
            });
        }
    });
  });
});
app.post("/hos_signup",function(req,res){
     const query={
        name:req.body.uname,
        email:req.body.email,
        pname:req.body.pname,
        loc:req.body.loc,
        mno:req.body.mno,
        password:req.body.password,
    }
    var location=req.body.loc;
    geocoder(location,function(n){

     hosOwner.create(query,function(err,Owner){
        if(err){
            console.log(err);
            res.status(400).send();
        }else{
             Owner.coordinates.push(n[0]);
            Owner.coordinates.push(n[1]);
            Owner.save();
            const an={
                name:req.body.pname,
                loc:req.body.loc,
                mno:req.body.mno,
                coordinates:Owner.coordinates,
            }
            Hospital.create(an,function(err,ws){
                if(err){
                    console.log(err);
                    res.status(400).send();
                }else{
                    console.log(ws);
                    res.status(200).send();
                }
            });
        }
    });
  });
});

app.post("/food_signup",function(req,res){
     const query={
        name:req.body.uname,
        email:req.body.email,
        pname:req.body.pname,
        loc:req.body.loc,
        mno:req.body.mno,
        password:req.body.password,
    }
    var location=req.body.loc;
    geocoder(location,function(n){

     foodOwner.create(query,function(err,Owner){
        if(err){
            console.log(err);
            res.status(400).send();
        }else{
             Owner.coordinates.push(n[0]);
            Owner.coordinates.push(n[1]);
            Owner.save();
            const an={
                name:req.body.pname,
                loc:req.body.loc,
                mno:req.body.mno,
                coordinates:Owner.coordinates,
            }
            Food.create(an,function(err,ws){
                if(err){
                    console.log(err);
                    res.status(400).send();
                }else{
                    console.log(ws);
                    res.status(200).send();
                }
            });
        }
    });
  });
});
app.post("/fetchWs",function(req,res){
    Workshop.find({},function(err,ws){
        if(err){
             console.log(err);
             res.status(400).send();
         }else{
            var obj=[];
            var loc=[];var coordinates=[];
            ws.forEach(function(i){
                obj.push(i.name);
                loc.push(i.loc);
                coordinates.push(i.coordinates[0]);
                coordinates.push(i.coordinates[1]);
            });
            const ob={
                objs:obj,
                loc:loc
            }
            console.log(ob);
            res.status(200).send(JSON.stringify(ob));
         }
    });
});

app.post("/fetchFood",function(req,res){
    Food.find({},function(err,ws){
        if(err){
             console.log(err);
             res.status(400).send();
         }else{
            var obj=[];
            var loc=[];var coordinates=[];
            ws.forEach(function(i){
                obj.push(i.name);
                loc.push(i.loc);
                coordinates.push(i.coordinates[0]);
                coordinates.push(i.coordinates[1]);
            });
            const ob={
                objs:obj,
                loc:loc
            }
            console.log(ob);
            res.status(200).send(JSON.stringify(ob));
         }
    });
});


app.post("/fetchHos",function(req,res){
    Hospital.find({},function(err,ws){
        if(err){
             console.log(err);
             res.status(400).send();
         }else{
            var obj=[];
            var loc=[];var coordinates=[];
            ws.forEach(function(i){
                obj.push(i.name);
                loc.push(i.loc);
                coordinates.push(i.coordinates[0]);
                coordinates.push(i.coordinates[1]);
            });
            const ob={
                objs:obj,
                loc:loc
            }
            console.log(ob);
            res.status(200).send(JSON.stringify(ob));
         }
    });
});
app.post("/fetchWSDetail",function(req,res){
    Workshop.findOne({name:req.body.wname},function(err,foundws){
        if(err){
             console.log(err);
             res.status(400).send();
         }else{
            const ob={
                pName:foundws.name,
                Loc:foundws.loc,
                mno:foundws.mno,
                coordinate1:foundws.coordinates[0],
                coordinate2:foundws.coordinates[1]
            }
           res.status(200).send(JSON.stringify(ob));
         }
    });
});

app.post("/fetchFoodDetail",function(req,res){
    Food.findOne({name:req.body.fname},function(err,foundws){
        if(err){
             console.log(err);
             res.status(400).send();
         }else{
            const ob={
                pName:foundws.name,
                Loc:foundws.loc,
                mno:foundws.mno,
                coordinate1:foundws.coordinates[0],
                coordinate2:foundws.coordinates[1]
            }
           res.status(200).send(JSON.stringify(ob));
         }
    });
});
app.post("/fetchHosDetail",function(req,res){
    Hospital.findOne({name:req.body.hname},function(err,foundws){
        if(err){
             console.log(err);
             res.status(400).send();
         }else{
            const ob={
                pName:foundws.name,
                Loc:foundws.loc,
                mno:foundws.mno,
                coordinate1:foundws.coordinates[0],
                coordinate2:foundws.coordinates[1]
            }
           res.status(200).send(JSON.stringify(ob));
         }
    });
});


var ifbike=12;
var availer=[]
var handlerlock=false,pushval=false;

var handler=(lat,long,device_id)=>{
   handlerlock=true;
   pushval=true;
   console.log("Inside handler body");
    setTimeout(()=>{
       console.log("Going to make push val false");
       pushval=false;
       console.log("Inside settimeout");
       counter(lat,long,device_id);
       console.log("Going to make handler false");
       handlerlock=false;
    },1000*30);
}

var counter=(lat,long,device_id)=>{
  var temp=availer.filter(x =>parseInt(x) ===1).length;
  console.log("temp="+temp+"availer="+Math.round(availer.length/1.5));
  if(temp>=Math.round(availer.length/1.5)){
          console.log("The bike is available confirmly");
    Parking.findOne({_id:ObjectId(device_id)},function(err,found){
    if(err){
        console.log(err);
    }else{
        found.coordinates.set(0,-1);
        found.coordinates.set(1,-1);
        found.save();
        console.log(found);
    }
    })
  }
  else {
    console.log("There is no Bike in slot confirmly");

    Parking.findOne({_id:ObjectId(device_id)},function(err,found){
    if(err){
        console.log(err);
    }else{
        found.coordinates.set(0,lat);
        found.coordinates.set(1,long);
        found.save();
        console.log(found);
    }
    })
    }
  console.log(availer);
  availer=[];
  
}


app.post('/geo', (req, res) => {
    // console.log("Hey");
  var lat=req.body["lat"];
  var long=req.body["long"];
  console.log(req.body);

  var distance=req.body["distance"];
  var apikey=req.body["apikey"];
  // var coordinates=[];
  // coordinates.push(lat);
  // coordinates.push(long);
  // console.log(coordinates);
  var device_id=req.body["device_id"];

   if (distance>ifbike+10) {
    if(handlerlock==false){
      handler(lat,long,device_id);
         }
    if(pushval==true){
         console.log("BIKE IS NOT AVAILABLE");
         availer.push(0);
    }
  }
  else{
    if(handlerlock==false){
      handler(lat,long,device_id);
    }
    if(pushval=true){
    availer.push(1);
    console.log("BIKE IS PRESENT");
    }
  }

  // console.log(lat,long,device_id,distance);
  res.status(200).end();
  }); 
app.listen(3000, () => {
    console.log("Listening on port 3000...")
});

module.exports=app;