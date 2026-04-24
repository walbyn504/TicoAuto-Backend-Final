const gql = String.raw; // Utiliza String.raw para definir el esquema GraphQL como un string

// Importa el modelo de Vehiculo para realizar consultas a la base de datos
const vehiculoTypeDefs = gql`

  // Define el tipo Usuario con sus campos
  type Usuario {
    id: ID!
    nombre: String!
    primerApellido: String
    segundoApellido: String
    correo: String
    telefono: String
  }

  //Define el tipo Vehiculo con sus campos y la relación con el tipo Usuario
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

  // Define el tipo Vehiculos Paginados para manejar la paginacion
  type VehiculosPaginados {
    vehiculos: [Vehiculo!]!
    paginaActual: Int!
    totalPaginas: Int!
  }

  // Define las consultas
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