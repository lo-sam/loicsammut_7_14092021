'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Likes extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            models.Likes.belongsTo(models.User, {
                    foreignKey: {
                        allowNull: false,
                    }
                }),
                models.Likes.belongsTo(models.Message, {
                    foreignKey: {
                        allowNull: false,
                    }
                })
        }
    };
    Likes.init({
        userId: DataTypes.INTEGER,
        messageId: DataTypes.INTEGER,
        likes: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'Likes',
    });
    return Likes;
};