import express from "express";
import cors from 'cors';
import mongodb from 'mongodb';
import dotenv from 'dotenv/config';
// initiate Express
const app = express();
const mongoClient = mongodb.MongoClient;
const MONGO_URL = process.env.MONGO_URL;
const PORT = process.env.PORT || 5000;
//MiddleWares
app.use(express.json());
app.use(cors({
    origin: "*"
}))

//Endpoints

app.get('/', async (req, res) => {
    try {
        let client = await mongoClient.connect(MONGO_URL);
        const db = client.db('todo-app');
        const data = await db.collection('tasks').find({}).toArray();
        await client.close();
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong!"
        })
    }
})

app.post('/createtask', async (req, res) => {
    try {
        let client = await mongoClient.connect(MONGO_URL);
        const db = client.db('todo-app');
        const data = await db.collection('tasks').insertOne(req.body);
        await client.close();
        res.json({
            message: "Task created Successfully!"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong!"
        })
    }
})

app.delete('/deletetask/:id', async (req, res) => {
    try {
        let client = await mongoClient.connect(MONGO_URL);
        const db = client.db('todo-app');
        const data = await db.collection('tasks').findOneAndDelete({ _id: mongodb.ObjectId(req.params.id) });
        await client.close();
        res.json({
            message: "Task Deleted Successfully!"
        });
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong!"
        })
    }
})

app.put('/updatetask/:id', async (req, res) => {
    try {
        let client = await mongoClient.connect(MONGO_URL);
        const db = client.db('todo-app');
        const data = await db.collection('tasks').findOneAndUpdate({ _id: mongodb.ObjectId(req.params.id) }, { $set: req.body });
        await client.close();
        res.json({
            message: "Task Updated Successfully!"
        });
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong!"
        })
    }
})



app.listen(PORT, () => console.log(`app is listening in port:: ${PORT}`));