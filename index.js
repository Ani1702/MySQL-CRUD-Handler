const express=require("express");
const app=express();
const port=8080;
const path=require("path");

//TO GENERATE FAKE DATA 
const { faker } = require('@faker-js/faker');

const mysql=require("mysql2");

//TO CONNECT MYSQL WITH BACKEND
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'dev_app',
    password:'Aniruddha$17mysql'
  });

// let q="SHOW TABLES";
let q="INSERT INTO user (id,username,email,password) VALUES ?"


let createRandomUser=()=> {
    return [
    faker.string.uuid(),
    faker.internet.userName(),
    faker.internet.email(),
    faker.internet.password()
    ];
  }

// let data=[];
// for(i=1;i<=100;i++){
//    data.push(createRandomUser()); //100 fake users data
// }

// let users=[["123b","123_newuserb","abcb@gmail.com","abcb"],["123c","123_newuserc","abcc@gmail.com","abcc"]];




const methodOverride = require('method-override')
app.use(methodOverride('_method'))

app.listen(port,()=>{
    console.log("app is listening to port",port)
});

app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use(express.static(path.join(__dirname,"public")));

app.set("views", path.join(__dirname,"views"));

app.set("view engine","ejs") ;


// let createRandomUser=()=> {
//     return {
//       userId: faker.string.uuid(),
//       username: faker.internet.userName(),
//       email: faker.internet.email(),
//       password: faker.internet.password()
//     };
//   } 


app.get("/",(req,res)=>{
    let q="SELECT count(*) FROM user"
    try{
        connection.query(q,(err,result)=>{
            if(err) throw err;
            let count=(result[0]["count(*)"]);
            res.render("home.ejs",{count});
        });
    } catch(err){
        console.log(err);
        res.send("Some Error Occured")
    }
    
})

app.get("/user",(req,res)=>{
    let q="SELECT * FROM user";
    try{
        connection.query(q,(err,result)=>{
            if(err) throw err;
            // console.log(result)
            users=result;
            res.render("showusers.ejs",{users})
        })
    } catch(err){
        console.log(err);
        res.send("Some Error occured in DB.")
    }

})

app.get("/user/:id/edit",(req,res)=>{
    let {id}=req.params;
    console.log(id);
    let q=`SELECT * FROM user WHERE id='${id}'`;
    try{
        connection.query(q,(err,result)=>{
            if(err) throw err;
            console.log(result)
            user=result[0];
            res.render("edit.ejs",{user})
        })
    } catch(err){
        console.log(err);
        res.send("Some Error occured in DB.")
    }
})


app.patch("/user/:id",(req,res)=>{
    let {id}=req.params;
    let {password: formPass, username: newUsername}=req.body;
    console.log(id);
    let q=`SELECT * FROM user WHERE id='${id}'`;

    try{
        connection.query(q,(err,result)=>{
            if(err) throw err;
            // console.log(result)
            user=result[0];
            if(formPass!=user.password){
                res.send("WRONG PASSWORD")
            } else{
                let q2=`UPDATE user SET username='${newUsername}' WHERE id='${id}'`
                connection.query(q2,(err,result)=>{
                    if(err) throw err;
                    res.redirect("/user")
                })   
            }
            // res.send(user)
        })
    } catch(err){
        console.log(err);
        res.send("Some Error occured in DB.")
    }
})


