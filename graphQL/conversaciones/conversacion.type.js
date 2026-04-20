const gql = String.raw;

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