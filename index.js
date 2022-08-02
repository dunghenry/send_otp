import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import cors from 'cors';
import twilio from 'twilio';
dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json({ extended: true, limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(morgan('dev'));
app.use(helmet());

//send mail
const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS
    }
})
transport.verify((error, success) => {
    if (error) {
        console.log(error);
        process.exit(1);
    }
    else {
        console.log("Ready for message successfully!");
        console.log(success);
    }
})
const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: 'trandungksnb00@gmail.com',
    subject: 'Verification Your Email',
    html: `<h1>Hello Tran Dung</h1>`
}
app.post("/send", async (req, res) => {
    try {
        const result = await transport.sendMail(mailOptions);
        if (result) {
            console.log(result);
            return res.status(201).json("Verification email sent successfully!");
        }
        else {
            return res.status(400).json("Verification email sent failed!");
        }
    } catch (error) {
        console.log(error);
    }
})

//send otp phone number
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = twilio(accountSid, authToken)
console.log(process.env.PHONE_AUTH);
app.post("/sendOTP", async (req, res) => {
    try {
        const rs = await client.messages.create({
            body: "Hello",
            from: process.env.PHONE_AUTH,
            to: "+84́866778584",
        });
        if (res) {
            return res.status(201).json("Sent message successfully!");
        }
        else {
            return res.status(500).json("Sent message fails!");
        }
    } catch (error) {
        return res.status(500).json("Server Internal Error");
    }
})
app.listen(4000, () => console.log('listening on http://localhost:4000'));