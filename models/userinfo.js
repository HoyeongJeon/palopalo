"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Userinfo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, { foreignKey: "userId", targetKey: "id" });
    }
  }
  Userinfo.init(
    {
      profile_picture: DataTypes.STRING,
      favorite_weather: DataTypes.STRING,
      location: DataTypes.STRING,
      introduce: DataTypes.STRING,
      nickname: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Userinfo",
    }
  );
  return Userinfo;
};
