
const mongoose = require('mongoose');

const uri = "mongodb+srv://adminjc:jc001password@cluster0.cunbu1c.mongodb.net/?appName=Cluster0";

async function testConnection() {
  console.log('Testing connection to:', uri.replace(/\/\/.*@/, '//<credentials>@'));
  
  try {
    // Mongoose 7+ doesn't need the options like useNewUrlParser
    await mongoose.connect(uri);
    console.log('Successfully connected to MongoDB!');
    await mongoose.disconnect();
  } catch (err) {
    console.error('Connection failed:', err);
    if (err.message.includes('ECONNREFUSED')) {
      console.log('\n--- DIAGNOSIS ---');
      console.log('ECONNREFUSED on SRV record usually means:');
      console.log('1. Your IP address is not whitelisted in MongoDB Atlas.');
      console.log('2. Your network/DNS is blocking SRV lookups.');
      console.log('3. The MongoDB cluster is currently unavailable.');
    }
  }
}

testConnection();
