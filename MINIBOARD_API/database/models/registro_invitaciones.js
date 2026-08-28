const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('registro_invitaciones', {
    iid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'invitacion',
        key: 'iid'
      }
    },
    did: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'diagrama',
        key: 'did'
      }
    },
    uid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'usuarios',
        key: 'uid'
      }
    }
  }, {
    sequelize,
    tableName: 'registro_invitaciones',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "registro_invitaciones_pkey",
        unique: true,
        fields: [
          { name: "did" },
          { name: "uid" },
        ]
      },
    ]
  });
};
