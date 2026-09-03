var DataTypes = require("sequelize").DataTypes;
var _columna = require("./columna");
var _diagrama = require("./diagrama");
var _invitacion = require("./invitacion");
var _mensaje = require("./mensaje");
var _participacion = require("./participacion");
var _registro_invitaciones = require("./registro_invitaciones");
var _rol = require("./rol");
var _tarjeta = require("./tarjeta");
var _usuarios = require("./usuarios");

/**
 * Iniciliaza los modelos/tavlas de la DB
 * @param {*} sequelize   Conexión a la base de datos
 * @returns {Object} modelos inicializados
 */
function initModels(sequelize) {
  var columna = _columna(sequelize, DataTypes);
  var diagrama = _diagrama(sequelize, DataTypes);
  var invitacion = _invitacion(sequelize, DataTypes);
  var mensaje = _mensaje(sequelize, DataTypes);
  var participacion = _participacion(sequelize, DataTypes);
  var registro_invitaciones = _registro_invitaciones(sequelize, DataTypes);
  var rol = _rol(sequelize, DataTypes);
  var tarjeta = _tarjeta(sequelize, DataTypes);
  var usuarios = _usuarios(sequelize, DataTypes);

  diagrama.belongsToMany(usuarios, { as: 'uid_usuarios', through: participacion, foreignKey: "did", otherKey: "uid" });
  diagrama.belongsToMany(usuarios, { as: 'uid_usuarios_registro_invitaciones', through: registro_invitaciones, foreignKey: "did", otherKey: "uid" });
  usuarios.belongsToMany(diagrama, { as: 'did_diagramas', through: participacion, foreignKey: "uid", otherKey: "did" });
  usuarios.belongsToMany(diagrama, { as: 'did_diagrama_registro_invitaciones', through: registro_invitaciones, foreignKey: "uid", otherKey: "did" });
  
  
  
  tarjeta.belongsTo(columna, { as: "cid_columna", foreignKey: "cid"});
  columna.hasMany(tarjeta, { as: "tarjeta", foreignKey: "cid"});
  columna.belongsTo(diagrama, { as: "did_diagrama", foreignKey: "did"});
  diagrama.hasMany(columna, { as: "columnas", foreignKey: "did"});
 
  mensaje.belongsTo(diagrama, { as: "did_diagrama", foreignKey: "did"});
  diagrama.hasMany(mensaje, { as: "mensajes", foreignKey: "did"});
 
  participacion.belongsTo(diagrama, {foreignKey: "did"});
  diagrama.hasMany(participacion, { as: "participacions", foreignKey: "did"});
 
  registro_invitaciones.belongsTo(diagrama, { as: "did_diagrama", foreignKey: "did"});
  diagrama.hasMany(registro_invitaciones, { as: "registro_invitaciones", foreignKey: "did"});
  registro_invitaciones.belongsTo(invitacion, { as: "iid_invitacion", foreignKey: "iid"});
  invitacion.hasMany(registro_invitaciones, { as: "registro_invitaciones", foreignKey: "iid"});
  invitacion.belongsTo(rol, { as: "rol_rol", foreignKey: "rol"});
  rol.hasMany(invitacion, { as: "invitacions", foreignKey: "rol"});
  participacion.belongsTo(rol, { as: "rnombre_rol", foreignKey: "rnombre"});
  rol.hasMany(participacion, { as: "participacions", foreignKey: "rnombre"});
  participacion.belongsTo(usuarios, { as: "uid_usuario", foreignKey: "uid"});
  usuarios.hasMany(participacion, { as: "participacions", foreignKey: "uid"});
  registro_invitaciones.belongsTo(usuarios, { as: "uid_usuario", foreignKey: "uid"});
  usuarios.hasMany(registro_invitaciones, { as: "registro_invitaciones", foreignKey: "uid"});

  return {
    columna,
    diagrama,
    invitacion,
    mensaje,
    participacion,
    registro_invitaciones,
    rol,
    tarjeta,
    usuarios,
  };
}
module.exports = initModels;

