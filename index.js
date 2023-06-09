const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3000

app.use(express.json());
app.use(cors());
require('dotenv').config()


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_ACC}:${process.env.DB_PASS}@cluster0.8odccbh.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function MongoRun() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const database = client.db("taskDB");
        const taskCollection = database.collection("tasks");
        // Send a ping to confirm a successful connection

        app.get('/task', async (req, res) => {
            const result = await taskCollection.find().toArray()
            res.send(result);
        })

        //post request to add task to the collection
        app.post('/task', async (req, res) => {
            const task = req.body
            // console.log(task)
            const result = await taskCollection.insertOne(task)
            res.send(result);
        })

        //update full task 
        app.patch('/task/:id', async (req, res) => {
            const id = req.params.id
            const task = req.body

            // console.log(id, task)
            const filter = { _id: new ObjectId(id) }

            const updateTask = {
                $set: {
                    title: task.title,
                    description: task.description,
                    status: task.status,
                    duration: task.duration
                },
            };
            const result = await taskCollection.updateOne(filter, updateTask)
            res.send(result)
        })

        //update status
        app.patch('/task/status/:id', async (req, res) => {
            const id = req.params.id
            const status = req.body

            // console.log(id, status)
            const filter = { _id: new ObjectId(id) }

            const updateTask = {
                $set: {
                    status: status.status,
                },
            };
            const result = await taskCollection.updateOne(filter, updateTask)
            res.send(result)
        })

        //delete task 
        app.delete('/task/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await taskCollection.deleteOne(query)
            res.send(result)
        })





        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
MongoRun().catch(console.dir);


app.listen(port, () => {
    console.log('listening on port http://localhost:%d', port);
});