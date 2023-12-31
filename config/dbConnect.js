const mongoose = require('mongoose');

const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('DB connected successfuly')
    } catch(error) {
        console.log('DB connection failed', error.message);
    }
};

dbConnect()