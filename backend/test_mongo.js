const mongoose = require('mongoose');

// Use the same URI as in server.js (or a test one)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://protheopetit_db_user:DuisWbGdxa8oPDD2@cluster0.7bmogti.mongodb.net/portfolio?appName=Cluster0';

async function testMongoDB() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB successfully.');

        // Define a temporary schema for testing
        const TestSchema = new mongoose.Schema({ name: String, date: Date });
        const TestModel = mongoose.model('Test', TestSchema);

        // Create a document
        const doc = new TestModel({ name: 'Test Entry', date: new Date() });
        await doc.save();
        console.log('✅ Document saved successfully.');

        // Read the document
        const found = await TestModel.findOne({ name: 'Test Entry' });
        if (found) {
            console.log('✅ Document retrieved successfully:', found.name);
        } else {
            console.error('❌ Document not found.');
        }

        // Clean up
        await TestModel.deleteMany({ name: 'Test Entry' });
        console.log('✅ Cleaned up test data.');

        mongoose.connection.close();
        console.log('Connection closed.');
    } catch (err) {
        console.error('❌ MongoDB Test Failed:', err);
        process.exit(1);
    }
}

testMongoDB();
