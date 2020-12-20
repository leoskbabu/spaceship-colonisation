const express = require ('express');
const app = express(); 

app.use(express.json());

//created a set of spaceship initially
const spaceships = [{
    id:1, 
    name:'space1',
    model:001,
    location:'1city1mars',
    status:'operational'
},
{
    id:2, 
    name:'space2',
    model:002,
    location:'2city1pluto',
    status:'decommisioned'
},
{
    id:3, 
    name:'space3',
    model:003,
    location:'3city2neptune',
    status:'maintanance'
}];
//created a set of locations initially
const locations = [{
    locid:1,
    cityname:'city1',
    planetname:'mars',
    spaceportcapacity:2,
    capacity:1
},
{
    locid:2,
    cityname:'city2',
    planetname:'neptune',
    spaceportcapacity:3,
    capacity:1
},
{
    locid:3,
    cityname:'city1',
    planetname:'pluto',
    spaceportcapacity:1,
    capacity:1
}];
//intro page
app.get('/',(req,res) => {
    res.send('Welcome to Spaceworld');
});

// To see all the spaceships
app.get('/spaceships',(req,res) => {
     res.send(spaceships);
});

//To see all locations
app.get('/locations',(req,res) => {
    res.send(locations);
}); 

//To add spaceships
app.post('/spaceships',(req,res)=>{
    const spaceship ={
        id: spaceships.length+1,
        name: req.body.name,
        model:req.body.model,
        location:req.body.location,
        status:req.body.status 
    };
    spaceships.push(spaceship);
    res.send(spaceship);
});
 
//to update the spaceship (we are passing the spaceship id in the url to update the status)
app.put('/spaceships/:id',(req,res)=>{
    const spaceship=spaceships.find(c=>c.id===parseInt(req.params.id));
    if(!spaceship) res.status(404).send('the spaceships is not found');
    spaceship.status=req.body.status;
    res.send(spaceship);
});

//to delete the spaceship(we are passing the spaceship id to delete the details of the spaceship)
app.delete('/spaceships/:id',(req,res)=>{
    const spaceship=spaceships.find(c=>c.id===parseInt(req.params.id));
    if(!spaceship) res.status(404).send('the spaceships is not found');
    const index = spaceships.indexOf(spaceship);
    spaceships.splice(index,1);
    res.send(spaceship);
});

//To add location
app.post('/locations',(req,res)=>{
    const location ={
        locid: locations.length+1,
        cityname: req.body.cityname,
        planetname:req.body.planetname,
        spaceportcapacity:req.body.spaceportcapacity,
        capacity:req.body.capacity
    };
    locations.push(location);
    res.send(location);
});

//to remove location(we are passing the location id to delete the location)
app.delete('/locations/:locid',(req,res)=>{
    const location=locations.find(c=>c.id===parseInt(req.params.id));
    if(!location) res.status(404).send('the location is not found');
    const index = locations.indexOf(location);
    locations.splice(index,1);
    res.send(location);
});

//To travel from on location to another(we are passing the spaceship id and id of the location to which the spaceship needs to travel)
app.put('/locations/:id/:locid',(req,res)=>{
    const location=locations.find(c=>c.locid===parseInt(req.params.locid));
    if(!location) res.status(404).send('the location is not found');
    const spaceship=spaceships.find(c=>c.id===parseInt(req.params.id));
    if(!spaceship) res.status(404).send('the spaceships is not found');
    let locationname = spaceship.location;
    const locationid = locationname[0];
    function locfind(l){
        return l.locid==locationid;
    }
    const slocation = locations.find(locfind)
    if(location.capacity<location.spaceportcapacity && spaceship.status=='operational'){
        spaceship.location=location.locid.toString().concat(location.cityname.concat(location.planetname));
        location.capacity+=1;
        slocation.capacity-=1;
        res.send('The spaceship reached the location');
    }
    else if(location.capacity>=location.spaceportcapacity){
        res.status(404).send('This location cant afford more spaceships,');
    }
    else if(spaceship.status=='decommisioned'||spaceship.status=='maintanance'){
        res.status(404).send('This spaceship cannot travel');
    }
});




const port = process.env.PORT || 3000;

app.listen(port, () => console.log('Server Started'));