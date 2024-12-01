const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const port = 3000;
const deviceRoutes = require('./routes');
const MONGO_URI ="mongodb+srv://Thana:ukicohort02@cluster0.dmvmt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0" ;
const app = express();
app.use(cors());
app.use(express.json());
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));
app.use('/API', deviceRoutes);
app.listen(port, () => {
    console.log('Server running on http://localhost:3000');
});