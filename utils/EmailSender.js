const nodemailer=require('nodemailer');
const sendEmail=(option)=>{
    const transport=nodemailer.createTransport({
        service:"Gmail",
        host:"smtp.gmail.com",
        port:587,
        secure: false,
        auth:{
            user:process.env.email,
            pass:process.env.password
        },tls: {
            rejectUnauthorized: false
        },
    });
    transport.sendMail(option,(err,info)=>{
        if(err)
        {
            return console.log(err);
            
        }
        console.log("Email send",info.response);
        
    })
}

module.exports={sendEmail};