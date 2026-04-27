
/* Incluye los tipos de Pregunta, Respuesta y Conversacion; y las consultas para
obtener las conversaciones del usuario y de los vehículos del usuario.*/

const gql = String.raw; // Definir el esquema GraphQL como un string


const conversacionTypeDefs = gql`

    type Pregunta {
        id: ID!
        pregunta: String!
        fechaPregunta: String!
        usuario: Usuario!
        vehiculo: Vehiculo!
    }


    type Respuesta {
        id: ID!
        respuesta: String!
        fechaRespuesta: String!
        usuarioRespuesta: ID!
        pregunta: ID!
    }


    type Conversacion {
        pregunta: Pregunta!
        respuesta: Respuesta
    }


    extend type Query {
        obtenerMisConversaciones: [Conversacion!]!
        obtenerConversacionesDeMisVehiculos: [Conversacion!]!
    }
`;

module.exports = conversacionTypeDefs;