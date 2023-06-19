import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    await client.connect();
    const db = client.db();

    await db.collection('users').insertOne({
      email,
      password,
    });

    res.status(201).json({ message: 'User registered successfully!' });
  }
}
