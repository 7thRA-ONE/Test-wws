const express = require('express');
const socketIo = require('socket.io');
const http = require('http');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const { fetchScore, updateScoreboard,removePlayer } = require("./model");

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// API to add a player
app.post('/addPlayer', async (req, res) => {
    try {
        const { playerName, score } = req.body;
        if (!playerName || score === undefined) {
            return res.status(400).send({ success: false, message: "Invalid data" });
        }

       let update =   await updateScoreboard(playerName, score);
       console.log(update)
        let players = await fetchScore();

        io.emit('updateScoreboard', players);
        res.json(players)
        
    } catch (error) {
        console.error("Error adding player:", error);
        res.status(500).send({ success: false, message: "Server error" });
    }
});
app.post('/delPlayer', async (req, res) => {
    try {
        const { playerName, score } = req.body;
        console.log({ playerName, score })
        if (!playerName || score === undefined) {
            return res.status(400).send({ success: false, message: "Invalid data" });
        }

       let update =   await removePlayer(playerName, score);
       console.log(update)
        let players = await fetchScore();

        io.emit('updateScoreboard', players);
        res.json(players)
        
    } catch (error) {
        console.error("Error adding player:", error);
        res.status(500).send({ success: false, message: "Server error" });
    }
});

// API to get players
app.get('/getPlayers', async (req, res) => {
    try {
        let players = await fetchScore();
        res.json(players); // Send only the data
    } catch (error) {
        console.error("Error fetching players:", error);
        res.status(500).send({ success: false, message: "Server error" });
    }
});

// Serve the HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'vr1.html'));
});

server.listen(3000, () => {
    console.log('Server running on port 3000');
});
