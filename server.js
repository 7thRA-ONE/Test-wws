const express = require('express');
const socketIo = require('socket.io');
const http = require('http');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let players = [];

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// API to add a player
app.post('/addPlayer', (req, res) => {
    const { playerName, score } = req.body;
    if (playerName && score !== undefined) {
        players.push({  playerName, score: parseInt(score) });
        io.emit('updateScoreboard', players);  // Emit to all clients
        res.status(200).send('Player added');
    } else {
        res.status(400).send('Invalid data');
    }
});

// API to get players
app.get('/getPlayers', (req, res) => {
    res.json(players);
});

// Serve the HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public','vr1.html'));
});

server.listen(3000, () => {
    console.log('Server running on port 3000');
});
