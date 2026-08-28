const Sequelize = require('sequelize');


module.exports = function(sequelize, DataTypes) {
  return sequelize.define('columna', {
    cid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    orden: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    did: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'diagrama',
        key: 'did'
      }
    },
    cnombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    color: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: "gray"
    }
  }, {
    sequelize,
    tableName: 'columna',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "columna_pkey",
        unique: true,
        fields: [
          { name: "cid" },
        ]
      },
    ]
  });
};
