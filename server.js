const express = require('express')
const cors = require('cors')
const app = express()
const PORT = 3001 

// const accountSid = "ACa46f1c23aeee8a99d5c2c037a27057b7";
// const authToken = "dd118b8163398148fe735b81466f80cf";
// const serviceId = "VA46ecc99e051edaf82341bea8177d146c"

const accountSid = "AC9ab2f276af70fbc65289b6ee4f5d18f9";
const authToken = "2e0edc2d75e63733230dad4cbaebdf0b";
const serviceId = "VA4424c71d842413f44afbb42f92c2d046"

const client = require('twilio')(accountSid, authToken);

app.use(express.static("public"))
app.use(express.json())
app.use(cors()) // Add this line to enable CORS

app.get(`/`,(req,res)=>{
    res.sendFile(__dirname + "/public/index.html")
})

app.post(`/send-verification-otp`,(req,res) => {
    const {mobileNumber} = req.body
    client.verify.v2.services(serviceId)
                .verifications
                .create({to: "+91" + mobileNumber, channel: 'sms'})
                .then(verification => {
                    return res.status(200).json({verification})
                })
                .catch(error => {
                   return res.status(400).json({error})
                });
})

app.post(`/verify-otp`,(req,res)=>{
    const {mobileNumber,code} = req.body
    client.verify.v2.services(serviceId)
      .verificationChecks
      .create({to: '+91' + mobileNumber, code: code})
      .then(verification_check =>{
        return res.status(200).json({verification_check})
      })
      .catch(error =>{
        return res.status(400).json({error})
      });
})

app.listen(PORT, ()=>{
    console.log('Server running on port '+PORT)
})