// Incluye los tipos de Pregunta, Respuesta y Conversacion, y las consultas correspondientes.
const gql = String.raw; // Utiliza String.raw para definir el esquema GraphQL como un string

// Importa los modelos de Pregunta, Respuesta y Vehiculo para realizar consultas a la base de datos
const conversacionTypeDefs = gql`

    // Define el tipo Pregunta con sus campos y relaciones
    type Pregunta {
        id: ID!
        pregunta: String!
        fechaPregunta: String!
        usuario: Usuario!
        vehiculo: Vehiculo!
    }

    // Define el tipo Respuesta con sus campos y relaciones
    type Respuesta {
        id: ID!
        respuesta: String!
        fechaRespuesta: String!
        usuarioRespuesta: ID!
        pregunta: ID!
    }

    // Define el tipo Conversacion que agrupa una pregunta con su posible respuesta
    type Conversacion {
        pregunta: Pregunta!
        respuesta: Respuesta
    }

    // Defiene las consultas para obtener las conversaciones del usuario
    extend type Query {
        obtenerMisConversaciones: [Conversacion!]!
        obtenerConversacionesDeMisVehiculos: [Conversacion!]!
    }
`;

module.exports = conversacionTypeDefs;