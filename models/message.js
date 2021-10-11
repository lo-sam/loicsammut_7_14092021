'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Message extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            models.Message.belongsTo(models.User, {
                foreignKey: {
                    allowNull: false,
                }
            })
        }
    };

    Message.init({
        title: DataTypes.STRING,
        content: DataTypes.STRING,
        urlmedia: DataTypes.STRING,
        likes: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'Message',
    });
    return Message;
};

/*

'use strict';
module.exports = (sequelize, DataTypes) => {
    const Message = sequelize.define('Message', {
        idUSERS: DataTypes.INTEGER,
        title: DataTypes.STRING,
        content: DataTypes.STRING,
        urlmedia: DataTypes.STRING,
        likes: DataTypes.INTEGER
    }, {
        classMethods: {
            associate: function(models) {
                models.Message.belongsTo(models.Users, {
                    foreignKey: {
                        allowNull: false
                    }
                })
            }
        }
    });
    return Message;
};*/