const gql = String.raw;

const vehiculoTypeDefs = gql`
  type Usuario {
    id: ID!
    nombre: String!
    primerApellido: String
    segundoApellido: String
    correo: String
    telefono: String
  }

  type Vehiculo {
    id: ID!
    marca: String!
    modelo: String!
    anno: Int!
    precio: Float!
    imagen: String!
    estado: String!
    combustible: String!
    color: String!
    transmision: String!
    condicion: String!
    usuario: Usuario
  }

  type VehiculosPaginados {
    vehiculos: [Vehiculo!]!
    paginaActual: Int!
    totalPaginas: Int!
  }

  extend type Query {
    filtroVehiculos(
      marca: String
      modelo: String
      anno_min: Int
      anno_max: Int
      precio_min: Float
      precio_max: Float
      estado: String
      page: Int!
      limit: Int!
    ): VehiculosPaginados!

    obtenerVehiculoPorId(id: ID!): Vehiculo
    obtenerMisVehiculos: [Vehiculo!]! # Devuelve una lista vehículos.
    obtenerVehiculoEdicion(id: ID!): Vehiculo 
  }
`;

module.exports = vehiculoTypeDefs;