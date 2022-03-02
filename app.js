
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
mongoose.connect('mongodb+srv://jatin_admin:test@123@clustercms.cbgap.mongodb.net/myFirstDatabase?retryWrites=true&w=majority/typesofIssues', {useNewUrlParser: true, useUnifiedTopology: true});
// mongoose.connect('mongodb://localhost:27017/typesofIssues', {useNewUrlParser: true, useUnifiedTopology: true});


// login 

const loginSchema = new mongoose.Schema({
    Username:String,
    Password:String
})
const Login = mongoose.model("Login",loginSchema);
const login1 = new Login({

    Username:"Ujjwal",
    Password:"Uk1234"
});
const login2 = new Login({
    
    Username:"Ved",
    Password:"Ved1234"
});

const logins = [login1,login2]
var a ="";



app.post("/",function(req,res){
  const enteredUsername = req.body.email;
  const enteredPassword = req.body.text;
  console.log(enteredUsername);
  console.log(enteredPassword);
  Login.findOne({Username:enteredUsername,Password:enteredPassword},function(err,matched){
      if(matched)
      {
          res.redirect("/finance");}
        else
        {
            // res.redirect("/");
            a = "Invalid Credentials";
            res.render("login",{error:a});
      }

  })

})




app.get("/",function(req,res){
    // Login.find({},function(err,foundItems){
    //     if(foundItems.length===0){
    //         Login.insertMany(logins,function(err){
    //             if(err){
    //                 console.log(err);
    //             } else{
    //                 console.log("Succesfully saved Everything!!")
    //             }
    //         });
    //     }});
    // a = "";
    res.render("login",{error:a})
    // res.render("login");
})
// //finance

 // daily issues 
 var today = new Date();
 var options = {
     day:"numeric",
     month:"long",
     year:"numeric"
 };
 var day = today.toLocaleDateString("en-IN",options);




const financeSchema = new mongoose.Schema({
    Date : String,
    Issues : String,
    Status: String,
    Location: String,
    Description:String
});
const FinanceIssue = mongoose.model("FinanceIssue",financeSchema);
const financeIssue1 = new FinanceIssue({

    Date:day,
    Issues:"Test",
    Status:"Test",
    Location:"test",
    Description:"koi problem nhi hai"
});
const financeIssue2 = new FinanceIssue({
    
    Date:day,
    Issues:"High quotation",
    Status: "Overdue",
    Location:"Madras",
    Description:"☺7╝ CMS"
});
const financeIssue3 = new FinanceIssue({
   
    Date:day,
    Issues:"Delayed Payment",
    Status: "Pending",
    Location:"Russia",
    Description:"asdfasdfjalksdfjadslf"
});
const existingIssues =[financeIssue1,financeIssue2,financeIssue3];

 // count of pending issues:
 //Finance
 var  countpendingF = 0;
 FinanceIssue.countDocuments({Status:"Pending"},function(err,foundPending){
    if(err)
    {
        console.log(err);
    }
    else
    {  
       countpendingF = foundPending;
    }
 });
 //count of Urgent issue:
 //Finance
 var countUrgentF = 0;
 FinanceIssue.countDocuments({Status:"Urgent"},function(err,foundUrgent){
    if(err)
    {
        console.log(err);
    }
    else
    {  
       countUrgentF = foundUrgent;
    }
 });
 // count of daily issues:
 //finance
 var countDailyIssue = 0;
 FinanceIssue.countDocuments({Date:day},function(err,foundnewIssue){
    if(err)
    {
        console.log(err);
    }
    else
    {  
       countDailyIssue = foundnewIssue;
    }
 });

 // total issues 
 var totalIssues = 0;
 FinanceIssue.countDocuments({},function(err,completeIssue){
    if(err)
    {
        console.log(err);
    }
    else
    {  
       totalIssues = completeIssue;
    }

 })

  // resolved issues count and method.
  const financeResolvedSchema = new mongoose.Schema({
     Date : String,
     Issues : String,
     Location: String
 });
 const FinanceResolved = mongoose.model("FinanceResolved",financeResolvedSchema);
  app.post("/changing",function(req,res){
      const checkedIssueID =req.body.checkthis;
      FinanceIssue.findById(checkedIssueID,function(err,docs){
          if(err)
          {
              console.log(err);
          }
          else
          {
             const financeResolved = new FinanceResolved({
 
                 Issues:docs.Issues,
                 Date:docs.Date,
                 Location:docs.Location
             });
             financeResolved.save();
             res.redirect('/finance');
          }
      });
      FinanceIssue.findByIdAndDelete(checkedIssueID,function(err){
          if(!err){
              console.log("successfully shifted checked item!");
              res.redirect("/finance");
          }  
      });
  });
 
  var countResolvedF = 0;
  FinanceResolved.countDocuments({},function(err,resolvedFcount){
      if(err)
      {
          console.log(err);
      }
      else
      {
          countResolvedF = resolvedFcount;
      }
  })



app.get("/finance", function(req, res){
    FinanceResolved.countDocuments({},function(err,resolvedFcount){
        if(err)
        {
            console.log(err);
        }
        else
        {
            countResolvedF = resolvedFcount;
        }
    })
  
    FinanceIssue.countDocuments({},function(err,completeIssue){
        if(err)
        {
            console.log(err);
        }
        else
        {  
           totalIssues = completeIssue;
        }
    
     })
    
    FinanceIssue.countDocuments({Status:"Pending"},function(err,foundPending){
        if(err)
        {
            console.log(err);
        }
        else
        {
            countpendingF = foundPending;
    
        }
     });
     FinanceIssue.countDocuments({Status:"Urgent"},function(err,foundUrgent){
        if(err)
        {
            console.log(err);
        }
        else
        {  
           countUrgentF = foundUrgent;
        }
     });
     FinanceIssue.countDocuments({Date:day},function(err,foundnewIssue){
        if(err)
        {
            console.log(err);
        }
        else
        {  
           countDailyIssue = foundnewIssue;
        }
     });
    FinanceIssue.find({},function(err,foundItems){
        // if(foundItems.length===0){
        //     FinanceIssue.insertMany(existingIssues,function(err){
        //         if(err){
        //             console.log(err);
        //         } else
        //         {  
        //          console.log("Succesfully saved Everything!!")
        //         }
        //     });
        //     res.redirect("/finance");
        // }
        // else
        // {  
        res.render("issues",{problems:foundItems,CountPFinance:countpendingF,CountUFinanace:countUrgentF,todayDate:countDailyIssue, CountFinanceR:countResolvedF,CountTFinance:totalIssues });
        // }
     
    });
  
 });




 //transport
 const transportSchema = new mongoose.Schema({
    Date : String,
    Issues : String,
    Status: String,
    Location: String,
    Description:String
});
const TransportIssue = mongoose.model("TransportIssue",transportSchema);
const transportIssue1 = new TransportIssue({

    Date:"test",
    Issues:"Test",
    Status:"Test",
    Location:"test",
    Description:"this is a test issue"
});
const transportIssue2 = new TransportIssue({
    
    Date:"5 July 2021",
    Issues:"High quotation",
    Status: "Overdue",
    Location:"Madras",
    Description:"this is shit"
});
const transportIssue3 = new TransportIssue({
   
    Date:"6 July 2021",
    Issues:"Delayed Payment",
    Status: "Pending",
    Location:"Russia",
    Description:"You belong in Gulag"
});
const existingIssuesTransport =[transportIssue1,transportIssue2,transportIssue3];

 //count of urgent issues
 //transportation
 var countUrgentT = 0;
 TransportIssue.countDocuments({Status:"Urgent"},function(err,foundUrgent){
    if(err)
    {
        console.log(err);
    }
    else
    {  
       countUrgentT = foundUrgent;
    }
 });
  // count of pending issues:
 //Transportation
 var  countpendingT = 0;
 
 TransportIssue.countDocuments({Status:"Pending"},function(err,foundPending){
    if(err)
    {
        console.log(err);
    }
    else
    {  
       countpendingT = foundPending;
    }
 });
 //count of daily issues
 var countDailyIssueTransport = 0;
 TransportIssue.countDocuments({Date:day},function(err,foundnewIssue){
    if(err)
    {
        console.log(err);
    }
    else
    {  
       countDailyIssueTransport = foundnewIssue;
    }
 });

 // Total transport issues

 var totalIssuesT = 0;
 TransportIssue.countDocuments({},function(err,completeIssue){
    if(err)
    {
        console.log(err);
    }
    else
    {  
       totalIssuesT = completeIssue;
    }

 })


   // resolved issues count and method.
   const transportResolvedSchema = new mongoose.Schema({
    Date : String,
    Issues : String,
    Location: String
});
const TransportResolved = mongoose.model("TransportResolved",transportResolvedSchema);
 app.post("/changingt",function(req,res){
     const checkedIssueID =req.body.checkthis;
     TransportIssue.findById(checkedIssueID,function(err,docs){
         if(err)
         {
             console.log(err);
         }
         else
         {
            const transportResolved = new TransportResolved({

                Issues:docs.Issues,
                Date:docs.Date,
                Location:docs.Location
            });
            transportResolved.save();
            res.redirect('/transportIssues')
         }
     });
     TransportIssue.findByIdAndDelete(checkedIssueID,function(err){
         if(!err){
             console.log("successfully shifted checked item!");
             res.redirect("/transportIssues");
         }  
     });
 });

 var countResolvedT = 0;
 TransportResolved.countDocuments({},function(err,resolvedTcount){
     if(err)
     {
         console.log(err);
     }
     else
     {
         countResolvedT = resolvedTcount;
     }
 })
 

app.get("/transportIssues", function(req, res){
    TransportIssue.countDocuments({},function(err,completeIssue){
        if(err)
        {
            console.log(err);
        }
        else
        {  
           totalIssuesT = completeIssue;
        }
    
     })
    
    TransportResolved.countDocuments({},function(err,resolvedTcount){
        if(err)
        {
            console.log(err);
        }
        else
        {
            countResolvedT = resolvedTcount;
        }
    })
  
    TransportIssue.countDocuments({Status:"Pending"},function(err,foundPending){
        if(err)
        {
            console.log(err);
        }
        else
        {  
           countpendingT = foundPending;
        }
     });
     TransportIssue.countDocuments({Status:"Urgent"},function(err,foundUrgent){
        if(err)
        {
            console.log(err);
        }
        else
        {  
           countUrgentT = foundUrgent;
        }
     });
     TransportIssue.countDocuments({Date:day},function(err,foundnewIssue){
        if(err)
        {
            console.log(err);
        }
        else
        {  
           countDailyIssueTransport = foundnewIssue;
        }
     });
    TransportIssue.find({},function(err,foundItems){
        // if(foundItems.length===0){
        //     TransportIssue.insertMany(existingIssuesTransport,function(err){
        //         if(err){
        //             console.log(err);
        //         } else{
        //             console.log("Succesfully saved Everything!!")
        //         }
        //     });
        //     res.redirect("/finance");
        // }
        // else
        // {
        res.render("transportIssues",{problems: foundItems,countPTransport:countpendingT,CountUTransport:countUrgentT,todayDateTransport:countDailyIssueTransport,CountTransportR:countResolvedT,CountTTransport:totalIssuesT});
        // }
    });
 });


//Accounting
 const accountSchema = new mongoose.Schema({
    Date : String,
    Issues : String,
    Status: String,
    Location: String,
    Description:String
});
const AccountIssue = mongoose.model("AccountIssue",accountSchema);
const accountIssue1 = new AccountIssue({

    Date:"account",
    Issues:"account",
    Status:"account",
    Location:"account",
    Description:"this is an accounts issue"
});
const accountIssue2 = new AccountIssue({
    
    Date:"5 July 2021",
    Issues:"High quotation",
    Status: "Overdue",
    Location:"Madras",
    Description:"koi issue nhi hai"
});
const accountIssue3 = new AccountIssue({
   
    Date:"6 July 2021",
    Issues:"Delayed Payment",
    Status: "Pending",
    Location:"Russia",
    Description:"another accounts issue"
});
const existingIssuesAccount =[accountIssue1,accountIssue2,accountIssue3];

var countpendingAcc = 0;

AccountIssue.countDocuments({Status:"Pending"},function(err,foundPending){
    if(err)
    {
        console.log(err);
    }
    else
    {  
       countpendingAcc = foundPending;
    }
 });
  //count of urgent issues
 //Account
 var countUrgentAcc = 0;
 AccountIssue.countDocuments({Status:"Urgent"},function(err,foundUrgent){
    if(err)
    {
        console.log(err);
    }
    else
    {  
       countUrgentAcc = foundUrgent;
    }
 });

 //count of daily issues
 var countDailyIssueAccount = 0;
 AccountIssue.countDocuments({Date:day},function(err,foundnewIssue){
    if(err)
    {
        console.log(err);
    }
    else
    {  
       countDailyIssueAccount = foundnewIssue;
    }
 });

 // resolved issues count and method.
 const accountResolvedSchema = new mongoose.Schema({
    Date : String,
    Issues : String,
    Location: String
});
const AccountResolved = mongoose.model("AccountResolved",accountResolvedSchema);
 app.post("/changingA",function(req,res){
     const checkedIssueID =req.body.checkthis;
     AccountIssue.findById(checkedIssueID,function(err,docs){
         if(err)
         {
             console.log(err);
         }
         else
         {
            const accountResolved = new AccountResolved({

                Issues:docs.Issues,
                Date:docs.Date,
                Location:docs.Location
            });
            accountResolved.save();
            res.redirect('/accountIssues');
         }
     });
     AccountIssue.findByIdAndDelete(checkedIssueID,function(err){
         if(!err){
             console.log("successfully shifted checked item!");
             res.redirect("/accountIssues");
         }  
     });
 });

 var countResolvedA = 0;
 AccountResolved.countDocuments({},function(err,resolvedAcount){
     if(err)
     {
         console.log(err);
     }
     else
     {
         countResolvedA = resolvedAcount;
     }
 })

 
 // Total account issues

 var totalIssuesA = 0;
 AccountIssue.countDocuments({},function(err,completeIssue){
    if(err)
    {
        console.log(err);
    }
    else
    {  
       totalIssuesA = completeIssue;
    }

 })


app.get("/accountIssues", function(req, res){   
    AccountIssue.countDocuments({},function(err,completeIssue){
        if(err)
        {
            console.log(err);
        }
        else
        {  
           totalIssuesA = completeIssue;
        }
    
     })
    AccountResolved.countDocuments({},function(err,resolvedAcount){
        if(err)
        {
            console.log(err);
        }
        else
        {
            countResolvedA = resolvedAcount;
        }
    })
AccountIssue.countDocuments({Status:"Pending"},function(err,foundPending){
    if(err)
    {
        console.log(err);
    }
    else
    {  
       countpendingAcc = foundPending;
    }
 });
 AccountIssue.countDocuments({Status:"Urgent"},function(err,foundUrgent){
    if(err)
    {
        console.log(err);
    }
    else
    {  
       countUrgentAcc = foundUrgent;
    }
 });
 AccountIssue.countDocuments({Date:day},function(err,foundnewIssue){
    if(err)
    {
        console.log(err);
    }
    else
    {  
       countDailyIssueAccount = foundnewIssue;
    }
 });
    AccountIssue.find({},function(err,foundItems){
        // if(foundItems.length===0){
        //     AccountIssue.insertMany(existingIssuesAccount,function(err){
        //         if(err){
        //             console.log(err);
        //         } else{
        //             console.log("Succesfully saved Everything!!")
        //         }
        //     });
        //     res.redirect("/accountIssues");
        // }
        // else
        // {
        res.render("accountIssues",{problems: foundItems,countPAccount:countpendingAcc,countUAcc: countUrgentAcc,todayDateAccount:countDailyIssueAccount,CountAccountR:countResolvedA,CountTAccount:totalIssuesA  });
        // }
    });
 });

// General issues
const generalSchema = new mongoose.Schema({
    Date : String,
    Issues : String,
    Status: String,
    Location: String,
    Description:String
});
const GeneralIssue = mongoose.model("GeneralIssue",generalSchema);
const generalIssue1 = new GeneralIssue({

    Date:"general",
    Issues:"general",
    Status:"general",
    Location:"general",
    Description:"ye general issue hai koi chinta nahi hai koi tension nahi hai"
});
const generalIssue2 = new GeneralIssue({
    
    Date:"5 July 2021",
    Issues:"High quotation",
    Status: "Overdue",
    Location:"Madras",
    Description:"ye koi aur issue hai"
});
const generalIssue3 = new GeneralIssue({
   
    Date:"6 July 2021",
    Issues:"Delayed Payment",
    Status: "Pending",
    Location:"Russia",
    Description:"asdujvbha;ujgbarpb;FLBG;LJAKDBG;ALJFB"
});
const existingIssuesGeneral =[generalIssue1,generalIssue2,generalIssue3];

var countpendingG = 0;

GeneralIssue.countDocuments({Status:"Pending"},function(err,foundPending){
    if(err)
    {
        console.log(err);
    }
    else
    {  
       countpendingG = foundPending;
    }
 });

//count of urgent issues
 //Account
 var countUrgentG = 0;
 GeneralIssue.countDocuments({Status:"Urgent"},function(err,foundUrgent){
    if(err)
    {
        console.log(err);
    }
    else
    {  
       countUrgentG = foundUrgent;
    }
 });
 //count of daily issues
 var countDailyIssueGeneral = 0;
 GeneralIssue.countDocuments({Date:day},function(err,foundnewIssue){
    if(err)
    {
        console.log(err);
    }
    else
    {  
       countDailyIssueGeneral = foundnewIssue;
    }
 });

    // resolved issues count and method.
    const generalResolvedSchema = new mongoose.Schema({
        Date : String,
        Issues : String,
        Location: String
    });
    const GeneralResolved = mongoose.model("GeneralResolved",generalResolvedSchema);
     app.post("/changingG",function(req,res){
         const checkedIssueID =req.body.checkthis;
         GeneralIssue.findById(checkedIssueID,function(err,docs){
             if(err)
             {
                 console.log(err);
             }
             else
             {
                const generalResolved = new GeneralResolved({
    
                    Issues:docs.Issues,
                    Date:docs.Date,
                    Location:docs.Location
                });
                generalResolved.save();
                res.redirect("/generalIssues");
             }
         });
         GeneralIssue.findByIdAndDelete(checkedIssueID,function(err){
             if(!err){
                 console.log("successfully shifted checked item!");
                 res.redirect("/generalIssues");
             }  
         });
     });
    
     var countResolvedG = 0;
     GeneralResolved.countDocuments({},function(err,resolvedGcount){
         if(err)
         {
             console.log(err);
         }
         else
         {
             countResolvedG = resolvedGcount;
         }
     })
     
      // Total generalIssues issues

 var totalIssuesG = 0;
 GeneralIssue.countDocuments({},function(err,completeIssue){
    if(err)
    {
        console.log(err);
    }
    else
    {  
       totalIssuesG = completeIssue;
    }

 })


app.get("/generalIssues", function(req, res){
    GeneralResolved.countDocuments({},function(err,resolvedGcount){
        if(err)
        {
            console.log(err);
        }
        else
        {
            countResolvedG = resolvedGcount;
        }
    })
    GeneralIssue.countDocuments({Status:"Pending"},function(err,foundPending){
        if(err)
        {
            console.log(err);
        }
        else
        {  
           countpendingG = foundPending;
        }
     });
     GeneralIssue.countDocuments({Status:"Urgent"},function(err,foundUrgent){
        if(err)
        {
            console.log(err);
        }
        else
        {  
           countUrgentG = foundUrgent;
        }
     });
     GeneralIssue.countDocuments({Date:day},function(err,foundnewIssue){
        if(err)
        {
            console.log(err);
        }
        else
        {  
           countDailyIssueGeneral = foundnewIssue;
        }
     });
    GeneralIssue.find({},function(err,foundItems){
        // if(foundItems.length===0){
        //     GeneralIssue.insertMany(existingIssuesGeneral,function(err){
        //         if(err){
        //             console.log(err);
        //         } else{
        //             console.log("Succesfully saved Everything!!")
        //         }
        //     });
        //     res.redirect("/generalIssues");
        // }
        // else
        // {
        res.render("generalIssues",{problems: foundItems,countPGeneral:countpendingG,countUGeneral: countUrgentG,todayDateGeneral:countDailyIssueGeneral,CountGeneralR: countResolvedG,CountTGeneral:totalIssuesG});
        // }
    });
 });


// resolved issues pages
 app.get("/resolved",function(req,res){
     FinanceResolved.find({},function(err,foundFitems){
        res.render("resolved",{problems:foundFitems});

     })
 
 })
 
 app.get("/resolvedA",function(req,res){
    AccountResolved.find({},function(err,foundFitems){
       res.render("resolvedA",{problems:foundFitems});

    })

})

app.get("/resolvedG",function(req,res){
    GeneralResolved.find({},function(err,foundFitems){
       res.render("resolvedG",{problems:foundFitems});

    })

})

app.get("/resolvedT",function(req,res){
    TransportResolved.find({},function(err,foundFitems){
       res.render("resolvedT",{problems:foundFitems});

    })

})




// urgent issues pages

 app.get("/urgent",function(req,res){
     FinanceIssue.find({Status:"Urgent"},function(err,founditems){
        res.render("urgent",{problems:founditems});

     });
   
 });
 app.get("/urgentA",function(req,res){
    AccountIssue.find({Status:"Urgent"},function(err,founditems){
       res.render("urgentA",{problems:founditems});

    });
  
});
app.get("/urgentG",function(req,res){
    GeneralIssue.find({Status:"Urgent"},function(err,founditems){
       res.render("urgentG",{problems:founditems});

    });
  
});
app.get("/urgentT",function(req,res){
    TransportIssue.find({Status:"Urgent"},function(err,founditems){
       res.render("urgentT",{problems:founditems});

    });
  
});







app.get("/form.html",function(req,res){
    res.render("form");
});
app.get("/chats/:issueName",function(req,res){


   const requestIssue = req.params.issueName;
   FinanceIssue.findOne({Issues:requestIssue},function(err,foundIssue){
       if(err){
           console.log(err)
       }
       else
       {
           res.render("chat",{clickedPrb:foundIssue})
          
       }
})}); 

app.get("/transportIssue/chats/:issueName",function(req,res){
    
    const requestIssue = req.params.issueName;
    TransportIssue.findOne({Issues:requestIssue},function(err,foundIssue){
        if(err){
            console.log(err)
        }
        else
        {
            res.render("chat",{clickedPrb:foundIssue})
           
        }
   })
   });
app.get("/accountIssue/chats/:issueName",function(req,res){
    
    const requestIssue = req.params.issueName;
    AccountIssue.findOne({Issues:requestIssue},function(err,foundIssue){
        if(err){
            console.log(err)
        }
        else
        {
            res.render("chat",{clickedPrb:foundIssue})
           
        }
   })
});
app.get("/generalIssue/chats/:issueName",function(req,res){
    
    const requestIssue = req.params.issueName;
    GeneralIssue.findOne({Issues:requestIssue},function(err,foundIssue){
        if(err){
            console.log(err)
        }
        else
        {
            res.render("chat",{clickedPrb:foundIssue})
           
        }
   })});

app.post("/finance",function(req,res){
    const issueDate  = req.body.openingDate;
    const location = req.body.location;
    const fNewIssue= req.body.newIssue;
    const status = req.body.Status;
    const description = req.body.IssueDescription;



    if (req.body.Department==="Finance"){
    const financeIssue = new FinanceIssue({

        Issues:fNewIssue,
        Date:issueDate,
        Status:status,
        Location:location,
        Description:description
    });
    financeIssue.save();
 }
     else if (req.body.Department === "Transportation") {
        const transportIssue = new TransportIssue({

            Issues:fNewIssue,
            Date:issueDate,
            Status:status,
            Location:location,
            Description:description
        });
        transportIssue.save();
    } else if (req.body.Department === "Accounts"){
        const accountIssue = new AccountIssue({
            Issues:fNewIssue,
            Date : issueDate,
            Status : status,
            Location: location,
            Description:description
        });
        accountIssue.save();
    } else {
        const otherIssue = new GeneralIssue({
            Issues:fNewIssue,
            Date : issueDate,
            Status : status,
            Location: location,
            Description:description
        });
        otherIssue.save();

    }
    res.redirect("/finance");
});

let port = process.env.PORT;
if (port == null || port == " "){
    port = 3000;
}

app.listen(port,function(){
    console.log("server is running on port 3000!!");
});