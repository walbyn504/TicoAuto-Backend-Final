
/* Resolvers de GraphQL para manejar las operaciones sobre vehículos.
Incluye la búsqueda de vehículos, detalles del vehículo, gestión de vehículos del usuario, y edición de vehículos.*/

const Vehiculo = require('../../modelos/vehiculo');
const validarFiltroVehiculos = require('../../validaciones/vehiculos/filtroVehiculos');

const vehiculoResolvers = {

    // Conversión del campo ID de vehículo a String para GraphQL
    Vehiculo: {
        id: (doc) => String(doc._id)
    },

    // Conversión del campo ID de Usuario a String para GraphQL
    Usuario: {
        id: (doc) => String(doc._id)
    },

    Query: {
        // Busqueda de vehículos con flitros y paginacón
        filtroVehiculos: async (_, args) => {
            try {
                const validacion = validarFiltroVehiculos(args); // Valida los filtros y parámetros de la paginación

                // Si hay un error de la validación, lanza un mensaje de error
                if (validacion.error) {
                    throw new Error(validacion.error);
                }

                
                const {
                    pagina,
                    limite,
                    annoMinNum,
                    annoMaxNum,
                    precioMinNum,
                    precioMaxNum
                } = validacion;

                const {
                    marca,
                    modelo,
                    anno_min,
                    anno_max,
                    precio_min,
                    precio_max,
                    estado
                } = args;

                // Construye el filtro basado en los parámetros de búsqueda proporcionados
                const filtro = {};


                if (marca) {
                    filtro.marca = {
                        $regex: marca,
                        $options: 'i'
                    };
                }

                if (modelo) {
                    filtro.modelo = {
                        $regex: modelo,
                        $options: 'i'
                    };
                }

                if (anno_min || anno_max) {
                    filtro.anno = {};
                    if (anno_min) filtro.anno.$gte = annoMinNum;
                    if (anno_max) filtro.anno.$lte = annoMaxNum;
                }

                if (precio_min || precio_max) {
                    filtro.precio = {};
                    if (precio_min) filtro.precio.$gte = precioMinNum;
                    if (precio_max) filtro.precio.$lte = precioMaxNum;
                }

                if (estado) {
                    filtro.estado = {
                        $regex: estado,
                        $options: 'i'
                    };
                }

                // Calcula el número de documentos a saltar para la paginación
                const skip = (pagina - 1) * limite; 

                // Cuenta el total de vehículos que coinciden con filtro para calcular el número total de páginas
                const totalVehiculos = await Vehiculo.countDocuments(filtro);
                const totalPaginas = Math.ceil(totalVehiculos / limite);

                // Realiza la consulta a la base de datos con los filtros
                const vehiculos = await Vehiculo.find(filtro)
                    .populate('usuario')
                    .skip(skip)
                    .limit(limite);

                return {
                    vehiculos,
                    paginaActual: pagina,
                    totalPaginas
                };

            } catch (error) {
                console.error(error);
                throw new Error('Ha ocurrido un error al procesar la búsqueda de vehículos');
            }
        },

        // Mostrar detalle del vehículo (público y privado).
        obtenerVehiculoPorId: async (_, { id }, contexto) => {
            try {
                // Busca el vehículo por su ID con la informacón del usuario asociado
                const vehiculo = await Vehiculo.findById(id).populate('usuario');

                // Si no encuentra el vehículo, lanza mensaje de error
                if (!vehiculo) {
                    throw new Error('Vehículo no encontrado');
                }

                let usuarioData;

                // Si el usuario está autenticado, retorna los datos completos del vehículo
                if (contexto.usuario) {
                    usuarioData = vehiculo.usuario;
                } else {
                    // En caso contrario, solo el nombre
                    usuarioData = {
                    nombre: vehiculo.usuario.nombre
                    };
                }

                return {
                    ...vehiculo.toObject(),
                    usuario: usuarioData
                };

            } catch (error) {
                console.error(error);
                throw new Error('Ha ocurrido un error al obtener la información del vehículo');
            }
        },

        // Mostrar la gestión de mis vehículos (solo usario logueado).
        obtenerMisVehiculos: async (_, __, contexto) => {
            try {
                // Verifica que el usuario esté autenticado
                if (!contexto.usuario) {
                    throw new Error('Usuario no autenticado');
                }

                // Busca los vehículos asociados al usuario que estén disponibles
                const vehiculos = await Vehiculo.find({
                    usuario: contexto.usuario.id,
                    estado: 'Disponible'
                }).populate('usuario');

                return vehiculos;

            } catch (error) {
                console.error(error);
                throw new Error('Ha ocurrido un error al obtener sus vehículos');
            }
        },

        // Obtener información de un vehículo propio para edición.
        obtenerVehiculoEdicion: async (_, { id }, contexto) => {
            try {
                // Verifica que el usuario esté autenticado
                if (!contexto.usuario) {
                    throw new Error('Usuario no autenticado');
                }

                // Busca el vehículo por su ID con la información del usuario asociado
                const vehiculo = await Vehiculo.findById(id).populate('usuario');

                if (!vehiculo) {
                    throw new Error('Vehículo no encontrado');
                }

                // Verifica que el vehículo pertenezca al usuario autenticado
                if (vehiculo.usuario._id.toString() !== contexto.usuario.id) {
                    throw new Error('No tiene permiso para editar este vehículo');
                }

                return vehiculo;

            } catch (error) {
                console.error(error);
                throw new Error('Ha ocurrido un error al procesar la solicitud');
            }
        }
    }
};

module.exports = vehiculoResolvers;