const path = require('path');
require('dotenv').config({
    path: path.resolve(__dirname, '../.env')
});
const { MongoClient } = require('mongodb');
let mongo;

async function connect(table) {
    try {
        mongo = await new MongoClient(process.env.MONGO).connect();
        
        // console.info(`* DB 'ink' Connected`);
        let res = mongo.db('ink');
        return res.collection(table);
    }
    catch (err) {
        console.error(`! ERR >>> ${err}`);
    }
}

async function close() {
    try {
        await mongo?.close(true);
    }
    catch (err) {
        console.error(`! ERR >>> ${err}`);
    }
}

module.exports = { connect, close };


//DB연결 테스트
// console.log('try connect to db');
// console.log(process.env.MONGO);
// client.then(c=>{
//     const db = c.db('ink');
//     db.collection('eong').insertOne({eong:'wow'});
// })

// .then((client) => {
//     const db = client.db('ink');
//     db.collection('eong').insertOne({ eong: 'cat' });
//     console.log('eong');
//     // console.log(db);
// })
// .catch((err) => {
//     console.log(err);
// })
//DB연결 테스트 종료