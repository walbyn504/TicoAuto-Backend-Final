// Definición de tipos GraphQL para la raíz y la integración de tipos específicos (vehículos y conversaciones). 
const gql = String.raw;// Utiliza String.raw para definir el esquema GraphQL como un string

const vehiculoTypeDefs = require('./vehiculos/vehiculo.type.js');
const conversacionTypeDefs = require('./conversaciones/conversacion.type.js');

// Definición de la consulta raíz para GraphQL, con un tipo de consulta vacío
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