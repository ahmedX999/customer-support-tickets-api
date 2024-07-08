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

exports.sendNotification = (userId, message) => {
    // Send email
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to: 'user@example.com', // Replace with actual user email
        subject: 'Ticket Notification',
        text: message,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
    });

    // Send WebSocket message
    connections.forEach((ws) => {
        if (ws.userId === userId) {
            ws.send(message);
        }
    });
};

exports.wss = wss;
