const nodemailer = require('nodemailer');
const WebSocket = require('ws');

// Set up WebSocket server
const wss = new WebSocket.Server({ noServer: true });

const connections = [];

wss.on('connection', (ws) => {
    connections.push(ws);

    ws.on('close', () => {
        const index = connections.indexOf(ws);
        if (index > -1) {
            connections.splice(index, 1);
        }
    });
});

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

exports.sendNotification = (email, message) => {
    // Send email
    const mailOptions = {
        from: process.env.EMAIL,
        to: email, // Use the provided email address
        subject: 'Ticket Notification',
        text: message,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
    });

    // Send WebSocket message (assuming you have a way to map email to WebSocket connections)
    connections.forEach((ws) => {
        if (ws.userEmail === email) {
            ws.send(message);
        }
    });
};

exports.wss = wss;
