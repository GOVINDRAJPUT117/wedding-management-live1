import nodemailer from 'nodemailer'
function sendDataOnMail(reciver_mail,message)
{
var transpoter = nodemailer.createTransport({
    service:'gmail',
    auth:
    {
        user:'govindrajput3191@gmail.com',
        pass:'xqqj yjae vwjl ibbd'
    }
})
var details = {
    from:'govindrajput3191@gmail.com',
    to:reciver_mail,
    subject:'batch ram',
   html: `
  <h1>Welcome to Wedding Management</h1>
  <p>This is a verification mail by my wedding management website</p>
  <h2>Email: ${reciver_mail} <br/> OTP: ${message}</h2>
`

}
transpoter.sendMail(details,(err,result)=>
{
    if(!err)
    {
          console.log("Otp Send On Your Mail : Plz Check"+result.response)   
    }
    else{
          console.log("Mail Not Send : "+err);
            console.log("Mail Not Send : "+JSON.stringify(err)); 
    }
})
}
export default sendDataOnMail;