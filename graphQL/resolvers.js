const vehiculoResolvers = require('./vehiculos/vehiculo.resolver');

const resolvers = {
    Query: {
        ...vehiculoResolvers.Query
    }
};

module.exports = resolvers;