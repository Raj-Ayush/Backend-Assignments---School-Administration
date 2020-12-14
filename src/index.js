const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const port = 8080;
const fs = require('fs'); 
const studentArray = require('./InitialData');
const localstudentArr = [...studentArray]; 
app.use(express.urlencoded());
// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// your code goes here

app.get("/api/student",(req, res) => {
        res.send(localstudentArr);
});

app.get("/api/student/:id",(req, res) => {
    const idToSearch = req.params.id;
    const matched = localstudentArr.filter(student => 
        student.id === Number(idToSearch)
    );
    if(matched.length === 0){
        res.send(404);
    }
    else{
        res.send(matched[0]);
    }    
});

const isNullorUndefined = (value) => value === null || value === undefined; 
let maxId = localstudentArr.length;
app.post("/api/student", (req, res) => {
    const newStuDetails = req.body;
    //console.log(newStuDetails);
    console.log(localstudentArr);
    const { name, currentClass, division } = newStuDetails;
    // console.log(name);
    // console.log(currentClass);
    // console.log(divison);
    if( isNullorUndefined(name)||
        isNullorUndefined(currentClass)||
        isNullorUndefined(division))
    {
        res.send(400);
    }
    else{
        const newId = maxId + 1;
        maxId = newId;
        newStuDetails.id = newId;
        localstudentArr.push(newStuDetails);
        res.send({ id : newId}); 
    }
});

app.put("/api/student/:id",(req, res) => {         
    const idToSearch = req.params.id;
    const update = req.body;
    const { name, currentClass, division } = update;
    const matchedIdx = localstudentArr.findIndex(
        (student) => student.id === Number(idToSearch)
    );
    if(matchedIdx === -1){
        req.send(400);
    }
    else if(
        isNullorUndefined(name)&&
        isNullorUndefined(currentClass)&&
        isNullorUndefined(division)
    ){
        req.send(400);
    }
    else{
        if(!isNullorUndefined(name)){
            localstudentArr[matchedIdx].name = name;
            
        } 
        if(!isNullorUndefined(currentClass)){
            localstudentArr[matchedIdx].currentClass = currentClass;
            
        } if(!isNullorUndefined(division)){
            localstudentArr[matchedIdx].division = division;
            
        } 
        res.send(200);
    }
    //console.log(localstudentArr);
});

app.delete("/api/student/:id",(req, res) => {
    const idToSearch = req.params.id;
    const matchIdx = localstudentArr.findIndex(
        student => student.id === Number(idToSearch)
    )
    if(matchIdx === -1){
        res.send(404);
    }
    else{
        localstudentArr.splice(matchIdx, 1);
        res.send(200 );
        
    }
})
app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app;   