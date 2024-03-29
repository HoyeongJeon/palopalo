"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
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
  Post.init(
    {
      title: DataTypes.STRING,
      content: DataTypes.STRING,
      photo: DataTypes.STRING,
      author: DataTypes.STRING,
      userId: DataTypes.INTEGER, //User 에서 참조한 왜래키
    },
    {
      sequelize,
      modelName: "Post",
    }
  );
  return Post;
};
