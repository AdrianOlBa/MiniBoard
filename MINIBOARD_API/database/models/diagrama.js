const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('diagrama', {
    did: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    dnombre: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    color: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: "gray"
    }
  }, {
    sequelize,
    tableName: 'diagrama',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "diagrama_pkey",
        unique: true,
        fields: [
          { name: "did" },
        ]
      },
    ]
  });
};
