
const Sequelize = require('sequelize');
const config = require("config");

/*sequelize DB Connection*/
const connectDB = async () => {
    try {
        const sequelize = new Sequelize(
            config.get('DB_NAME'),
            config.get('DB_USER'),
            config.get('DB_PASSWORD'), {
            host: config.get('DB_HOST'),
            dialect: 'mysql',
            allowNull: true,
            query: { raw: true }
        });
        global.sequelize = sequelize;
        sequelize.authenticate().then((res) => {
           console.log("connected to database");
        }).catch(err => {
             console.log('Unable to connect to the database', err);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        return process.exit(1);
    };
};

module.exports = connectDB;
