'use strict';
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        email: DataTypes.STRING,
        username: DataTypes.STRING,
        password: DataTypes.STRING,
        bio: DataTypes.STRING,
        isAdmin: DataTypes.BOOLEAN
    }, {
        classMethods: {
            associate: function(models) {
                models.User.hasMany(models.Message)
            }
        }
    });
    return User;
};