
/**
 * Manejador global de errores 
 */
const errorHandler = (err, req, res, next) => {
  const estado = err.statusCode || 500;
  const mensaje = err.message || "Error interno del servidor";

  res.status(estado).json({
    status: estado,
    error: mensaje
  });
};

module.exports = errorHandler;