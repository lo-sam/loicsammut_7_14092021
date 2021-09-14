'use strict';
module.exports = (sequelize, DataTypes) => {
    const Message = sequelize.define('Message', {
        idUSERS: DataTypes.INTEGER,
        title: DataTypes.STRING,
        content: DataTypes.STRING,
        attachment: DataTypes.STRING,
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
};