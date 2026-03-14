const database={
 
    users:[
      {id:"1",
       name:"Ali", 
       email:"Ali@example.com",
       password:"1232",
       wallet:{
        balance:12457, 
        currency:"MAD",
        cards:[
            {numcards:"124847", type:"visa",balance:"14712",expiry:"2027-08-14",vcc:"147"},
            {numcards:"124478", type:"mastercard",balance:"1470",expiry:"2028-08-14",vcc:"257"},
        ],
        transactions:[
            {id:"1", type:"credit",amount:140,date:"2025-08-14", from:"Ahmed" , to:"124847"},
            {id:"2", type:"debit",amount:200,date:"2025-08-13", from:"124847" , to:"Amazon"},
            {id:"3", type:"credit",amount:250,date:"2025-08-12", from:"Ahmed" , to:"124478"},
        ]
 
       }
      },
 
      {id:"2",
       name:"Sara",
       email:"Sara@example.com",
       password:"sara123",
       wallet:{
        balance:8200,
        currency:"MAD",
        cards:[
            {numcards:"234561", type:"visa",balance:"5000",expiry:"2026-12-01",vcc:"321"},
            {numcards:"234789", type:"mastercard",balance:"3200",expiry:"2027-05-20",vcc:"654"},
        ],
        transactions:[
            {id:"1", type:"credit",amount:500,date:"2025-08-10", from:"Khalid" , to:"234561"},
            {id:"2", type:"debit",amount:120,date:"2025-08-11", from:"234561" , to:"Marjane"},
            {id:"3", type:"debit",amount:80,date:"2025-08-12",  from:"234789" , to:"Netflix"},
        ]
       }
      },
 
      {id:"3",
       name:"Khalid",
       email:"Khalid@example.com",
       password:"khalid456",
       wallet:{
        balance:31000,
        currency:"MAD",
        cards:[
            {numcards:"378412", type:"visa",balance:"20000",expiry:"2028-03-15",vcc:"789"},
            {numcards:"378999", type:"mastercard",balance:"11000",expiry:"2029-01-10",vcc:"456"},
        ],
        transactions:[
            {id:"1", type:"credit",amount:1000,date:"2025-08-01", from:"Virement" , to:"378412"},
            {id:"2", type:"debit",amount:300,date:"2025-08-05",  from:"378412"   , to:"Amazon"},
            {id:"3", type:"credit",amount:750,date:"2025-08-09", from:"Ali"      , to:"378999"},
        ]
       }
      },
 
      {id:"4",
       name:"Fatima",
       email:"Fatima@example.com",
       password:"fatima789",
       wallet:{
        balance:5500,
        currency:"MAD",
        cards:[
            {numcards:"412365", type:"mastercard",balance:"5500",expiry:"2027-11-30",vcc:"112"},
        ],
        transactions:[
            {id:"1", type:"credit",amount:200,date:"2025-08-06", from:"Sara"    , to:"412365"},
            {id:"2", type:"debit",amount:50,date:"2025-08-07",   from:"412365"  , to:"Carrefour"},
            {id:"3", type:"credit",amount:400,date:"2025-08-13", from:"Khalid"  , to:"412365"},
        ]
       }
      }
 
    ]
}

const listusers=()=>{
    return database.users.map((u) => u.name);
}

const finduserbymail=(mail,password)=>{
    return database.users.find((u)=> u.email===mail && u.password===password
    );
}

export { listusers, finduserbymail };