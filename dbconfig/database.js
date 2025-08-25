const mongoose = require('mongoose');

async function connectToDatabase() {
  try {

    await mongoose.connect(process.env.DBURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true

    });
  
    

    console.log('Connected to MongoDB!');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}


exports.connectToDatabase=connectToDatabase;
