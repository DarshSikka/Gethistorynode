const fetch=require("node-fetch");
const joi=require("joi");
const express=require('express')
const app=express();
const port=process.env.PORT||3000;
const my_server=(data)=>{
app.get('/', (req, res)=>{
    let to_send="<h1>Events</h1>";
    for(var l=0;l<data.Events.length;l++){
      to_send+=data.Events[l].html+"<br>"
    }
    to_send+='<h1>Births</h1>'
    for(var n=0;n<data.Births.length;n++){
        to_send+=data.Births[n].html+"<br>"
      }
    to_send+="<h1>Deaths</h1>"
    for(var x=0;x<data.Deaths.length;x++){
        to_send+=data.Deaths[x].html+"<br>"
      }
    res.send(to_send);
})
app.get('/json', (req, res)=>{
    res.send(data);
})
}
const listen=()=>{
    app.listen(port, ()=>{console.log(`Go to port ${port} for viewing response or port${port}/json for viewing json data`)})
}
const schema=joi.object( {
   month:joi.number().min(1).max(12).required()
})
const http=require('http');
const days=[31,29,31,30,31,30,31,31,30,31,30,31]
const readline=require("readline").createInterface({
    input:process.stdin,
    output:process.stdout
})
    
readline.question("Enter a month", month=>{
    const result=schema.validate({month:month});
    if(result.error){
    console.log(result.error.details[0].message);
    process.exit();
    }
    readline.question("Enter a Day", day=>{
        const day_schema=joi.object({
            day:joi.number().max(days[month-1]).min(1)
        });
        const second=day_schema.validate({day:day});
        if(second.error){
            console.log(second.error.details[0].message);
            console.log("Process exited");
            process.exit()
        }
        const url= `https://history.muffinlabs.com/date/${month}/${day}`
        fetch(url).then(
            (response)=>response.text().then((text)=>{
              const obj=JSON.parse(text);
              const data=obj.data;
              my_server(data);
              listen();
            }))
    }    
        );
    })