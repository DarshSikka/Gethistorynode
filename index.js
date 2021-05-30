const fetch=require("node-fetch");
const joi=require("joi");
const express=require('express')
const app=express();
const port=process.env.PORT||3000;
const days=[31,29,31,30,31,30,31,31,30,31,30,31];
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
    app.listen(port, ()=>{console.log('\x1b[36m%s\x1b[0m', `Go to port ${port} for viewing response or port${port}/json for viewing json data]`)})
}
const schema=joi.object({
   month:joi.number().min(1).max(12).required()
})
const month=process.argv[2]
const day=process.argv[3]
if(!month){
  console.log("Month is required please re-enter");
  process.exit()
}
if(!day){
  console.log("Day is required please re-enter")
  process.exit()
}
const result=schema.validate({month:month});
if(result.error){
console.log(result.error.details[0].message);
process.exit();
}
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
    console.log("Loading Data……")
    fetch(url).then(
        (response)=>response.text().then((text)=>{
          const obj=JSON.parse(text);
          const data=obj.data;
          my_server(data);
          console.log(`Oldest Event: ${data.Events[0].html}`);
          console.log(`Oldest Birth: ${data.Births[0].html}`);
          console.log(`Oldest Death: ${data.Deaths[0].html}`)
          listen();
        }));
