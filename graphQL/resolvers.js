// Combina los resolvers de vehículos y conversaciones en un único objeto.
const vehiculoResolvers = require('./vehiculos/vehiculo.resolver');
const conversacionesResolvers = require('./conversaciones/conversacion.resolver');

const resolvers = {
    Query: {
        ...vehiculoResolvers.Query,
        ...conversacionesResolvers.Query
    },

    Vehiculo: {
        ...vehiculoResolvers.Vehiculo
    },

    Usuario: {
        ...vehiculoResolvers.Usuario
    },

    Pregunta: {
        ...conversacionesResolvers.Pregunta
    },

    Respuesta: {
        ...conversacionesResolvers.Respuesta
    }
};

module.exports = resolvers;