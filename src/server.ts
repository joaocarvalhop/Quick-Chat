import express from 'express';
import http from 'http';
import path from 'node:path';
import { Server } from 'socket.io';
import Message from './model/Message';
import startDatabase from "./db/config"
import { v4 as uuidV4 } from "uuid";
import mongoose from 'mongoose';

const app = express();
const server = http.createServer(app);
const io = new Server(server, { connectionStateRecovery: {} });
const dirname = path.dirname(__filename);

startDatabase();

app.use(express.static(path.join(dirname, '../public')));

app.get('/', (req, res) => { res.sendFile('index.html') });

io.on('connection', async (socket) => {
    console.log(`A user ${socket.id} connected\n`);

    socket.on('chat message', async (msg) => {
        let result;
        try {
            result = await Message.create({ messageId: uuidV4(), user: socket.id, message: msg });
        } catch (error) {
            console.log(error);
            return;
        }

        io.emit('chat message', msg, result.messageId);
    });

    if (!socket.recovered) {
        try {
            const serverOffset = socket.handshake.auth.serverOffset;
            let query: any = {};

            if (serverOffset && 
                mongoose.Types.ObjectId.isValid(serverOffset)) {
                query = { _id: { $gt: new mongoose.Types.ObjectId(serverOffset) } };
            }

            const cursor = Message.find(query).sort({ _id: 1 }).cursor();

            cursor.on('data', (doc) => { socket.emit('chat message', doc.message, doc.messageId) });

            cursor.on('end', () => { console.log('All messages have been sent to the socket.') });

            cursor.on('error', (err) => { console.error(err) });
        } catch (error) {
            console.log(error)
            return;
        }
    }

    socket.on('disconnect', () => console.log(`A user ${socket.id} disconnected\n`));
});

server.listen(3000, () => console.log('listening on http://localhost:3000/'));
