const {connect} = require('mongoose');

const connectToDatabase = async(url) => {
    try {
        await connect(url);
        console.log("Connected!");
    } catch (error) {
        console.log (error);
    }
}

module.exports = connectToDatabase;