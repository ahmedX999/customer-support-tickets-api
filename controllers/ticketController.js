const Ticket = require('../models/Ticket');
const User = require('../models/User');
const { sendNotification } = require('../utils/notifications');

exports.createTicket = async (req, res) => {
    const { title, description } = req.body;
    const createdBy = req.user.id;

    try {
        const ticket = new Ticket({ title, description, createdBy });
        await ticket.save();
        res.status(201).json(ticket);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateTicketStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        //populate assignedTo email + name
        const ticket = await Ticket.findByIdAndUpdate(id, { status }, { new: true }).populate('createdBy', 'email').populate('assignedTo', 'email');
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        sendNotification(ticket.createdBy.email, `Your ticket with id ${id} status has been updated to ${status} due to ${ticket.assignedTo.email || 'no one'} assignment`);
        if (ticket.assignedTo) {
            sendNotification(ticket.assignedTo.email, `Ticket with id ${id} status has been updated to ${status}`);
        }

        res.json(ticket);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.assignTicket = async (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;

    try {
        const ticket = await Ticket.findByIdAndUpdate(id, { assignedTo: userId }, { new: true }).populate('assignedTo', 'email');
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        sendNotification(ticket.assignedTo.email, `You have been assigned to a new ticket`);
        res.json(ticket);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteTicket = async (req, res) => {
    const { id } = req.params;

    try {
        const ticket = await Ticket.findByIdAndDelete(id);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        res.json({ message: 'Ticket deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.listAllTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find().populate('createdBy', 'name email').populate('assignedTo', 'name email');
        res.json(tickets);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateTicket = async (req, res) => {
    const { id } = req.params;
    const { title, description, status } = req.body;

    try {
        const ticket = await Ticket.findById(id).populate('createdBy', 'email').populate('assignedTo', 'email');
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        if (title) ticket.title = title;
        if (description) ticket.description = description;
        if (status) ticket.status = status;

        await ticket.save();

        if (status) {
            sendNotification(ticket.createdBy.email, `Your ticket status has been updated to ${status}`);
            if (ticket.assignedTo) {
                sendNotification(ticket.assignedTo.email, `Ticket status has been updated to ${status}`);
            }
        }

        res.json(ticket);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

//list all tickets created by authenticated user

exports.listMyTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find({ createdBy: req.user.id }).populate('createdBy', 'name email').populate('assignedTo', 'name email');
        res.json(tickets);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


//list all tickets assigned to authenticated user

exports.listMyAssignedTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find({ assignedTo: req.user.id }).populate('createdBy', 'name email').populate('assignedTo', 'name email');
        res.json(tickets);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};