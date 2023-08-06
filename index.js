const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DBUSER}:${process.env.DBPASS}@cluster0.hqbzo.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const serviceCollection = await client.db('barberYusuf').collection('services')
        const timesCollection = await client.db('barberYusuf').collection('times')
        const beardsCollection = await client.db('barberYusuf').collection('beards')
        const reviewsCollection = await client.db('barberYusuf').collection('reviews')

        //get 
        //some services at home
        app.get('/homeservices', async(req, res)=>{
            const query = {}
            const cursor = await serviceCollection.find(query).limit(3).toArray()
            res.send(cursor)
        })

        //get
        //all services at home
        app.get('/allservices', async(req, res)=>{
            const query = {}
            const cursor = await serviceCollection.find(query).toArray()
            res.send(cursor)
        })

        //get
        //specific service
        app.get('/services/:id', async(req, res)=>{
            const id = req.params.id
            const query = {_id: new ObjectId(id)}
            const service = await serviceCollection.findOne(query)
            res.send(service)
        })

        //get
        //all time schedule
        app.get('/times', async(req, res)=>{
            const query = {}
            const cursor = await timesCollection.find(query).toArray()
            res.send(cursor)
        })

        //get
        //all beard style
        app.get('/beards', async(req, res)=>{
            const query = {}
            const cursor = await beardsCollection.find(query).toArray()
            res.send(cursor)
        })

        //get
        //reviews
        app.get('/reviews', async(req, res)=>{
            const serviceid = req.query.serviceid
            const query = {serviceid: serviceid}    
            const cursor = await reviewsCollection.find(query).toArray()
            res.send(cursor)
        })

        //get
        //only my reviews
        app.get('/myreviews', async(req, res)=>{
            const myemail = req.query.email
            const query = {email: myemail}
            const cursor = await reviewsCollection.find(query).toArray()
            res.send(cursor)
        })


        //post 
        //personal review
        app.post('/reviews', async(req, res)=>{
            const review = req.body
            const cursor = await reviewsCollection.insertOne(review)
            res.send(cursor)
        })

        //update 
        //my review
        app.patch('/myreviews/:id', async(req, res)=>{
            const id = req.params.id
            const newmessage = req.body.change
            console.log(newmessage)
            const query = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updatedDoc = {
                $set:{
                    message: newmessage
                }
            }
            const cursor = await reviewsCollection.updateOne(query, updatedDoc, options);
            res.send(cursor);
        })

        //delete 
        //my review
        app.delete('/myreviews/:id', async(req, res)=>{
            const id = req.params.id
            const query = {_id: new ObjectId(id)}
            const cursor = await reviewsCollection.deleteOne(query)
            res.send(cursor)
        })

    }
    finally{

    }
}
run().catch(err => console.error(err));

app.get('/', (req, res) =>{
    res.send('Successfully running crud-barber-server')
})

app.listen(port, () => {
    console.log(`crud-barber-server is listening on ${port}`)
})