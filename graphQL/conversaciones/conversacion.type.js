const gql = String.raw;

const conversacionTypeDefs = gql`
    type UsuarioConversacion {
        id: ID!
        nombre: String!
    }

    type VehiculoConversacion {
        id: ID!
        marca: String!
        modelo: String!
        usuario: UsuarioConversacion
    }

    type Pregunta {
        id: ID!
        pregunta: String!
        fechaPregunta: String!
        usuario: UsuarioConversacion!
        vehiculo: VehiculoConversacion!
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