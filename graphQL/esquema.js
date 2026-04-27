

// Une los tipos de vehículo y conversación en un único esquema

const gql = String.raw;// Definir el esquema GraphQL como un string

const vehiculoTypeDefs = require('./vehiculos/vehiculo.type.js');
const conversacionTypeDefs = require('./conversaciones/conversacion.type.js');


// Crea un query base vacio para extenderlo en los otros tipos
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