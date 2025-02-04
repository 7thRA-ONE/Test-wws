const { createReadStream } = require("fs");
const mongoose = require("mongoose");

const URL = "mongodb+srv://BLAZE:17sbzLXk9c9C9LCZ@web.jt6zi1q.mongodb.net/?retryWrites=true&w=majority&appName=Web";

// Create a Mongoose connection
let Scoredb = mongoose.createConnection(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

Scoredb.once("open", () => {
    console.log("Connected to Database");
});

Scoredb.on("error", (err) => {
    console.error("Database connection error:", err);
});

// Define Schema
const scoreSchema = new mongoose.Schema({
    teamName: { type: String, required: true },
    score: { type: Number, default: 0 }, // Changed from Array to Number
});

// Create Model
const ScoreModel = Scoredb.model("Scores", scoreSchema);

module.exports = ScoreModel;

// Fetch Score Function
const fetchScore = async (teamName) => {
    try {
        let score = await ScoreModel.find({ });

        if (!score) {
            return { success: false, data: "Not found" };
        }

        return { success: true, data: score };
    } catch (error) {
        console.error("Error fetching score:", error);
        return { success: false, error: "Database error" };
    }
};

const updateScoreboard = async (player, score) => {
    try {
        if (!player) {
            return { success: false, data: "Invalid data type" };
        }

        if (!score || isNaN(score)) {
            return { success: false, data: "Provide a valid number" };
        }

        let user = await ScoreModel.findOne({ teamName: player });

        if (!user) {
            let createUser = new ScoreModel({
                teamName: player,
                score: parseInt(score)
            });

            await createUser.save();
            return { success: true, data: "User created and score added" };
        } else {
            await user.updateOne({ score: parseInt(score) });
            return { success: true, data: "Score updated" };
        }
    } catch (error) {
        console.error("Error updating scoreboard:", error);
        return { success: false, error: "Database error" };
    }
};


const removePlayer = async (teamName) => {
    try {
        if (!teamName) {
            return { success: false, message: "Invalid team name provided." };
        }

        const user = await ScoreModel.findOne({ teamName });

        if (!user) {
            return { success: false, message: "Team not found." };
        }

        await ScoreModel.findOneAndDelete({ teamName });

        return { success: true, message: "Team successfully removed." };
    } catch (error) {
        console.error("Error removing team:", error);
        return { success: false, message: "Database error occurred." };
    }
};


const clearAllTeams = async () => {
    try {
        const result = await ScoreModel.deleteMany({}); // Deletes all documents in the collection
        return { success: true, message: "All teams successfully deleted.", deletedCount: result.deletedCount };
    } catch (error) {
        console.error("Error clearing teams:", error);
        return { success: false, message: "Database error occurred." };
    }
};

module.exports = {
    updateScoreboard,
    fetchScore,
    removePlayer,
    clearAllTeams



};

 
