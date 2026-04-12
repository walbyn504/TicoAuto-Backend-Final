
const gql = String.raw;
const vehiculoTypeDefs = require('./vehiculos/vehiculo.type.js');
const conversacionTypeDefs = require('./conversaciones/conversacion.type.js');

const rootTypeDefs = gql`
  type Query {
    _empty: String
  }
`;

module.exports = [
    rootTypeDefs,
    vehiculoTypeDefs,
    conversacionTypeDefs
];