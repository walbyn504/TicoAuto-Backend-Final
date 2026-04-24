// Validación de paginación para la consulta de vehículos
function validarPaginacion(page, limit) {
    const pagina = parseInt(page);
    const limite = parseInt(limit);

    // Si no proporciona pagina o no es un numero valido, devuelve mensaje de error
    if (isNaN(pagina) || pagina < 1) {
        return {
            error: "La página debe ser un número mayor o igual a 1"
        };
    }

    // Si no proporciona limite o no es un numero valido, devuelve mensaje de error
    if (isNaN(limite) || limite < 1) {
        return {
            error: "El límite debe ser un número mayor o igual a 1"
        };
    }

    return { pagina, limite };
}

// Validación de rangos para la consulta de vehículos
function validarRangos(anno_min, anno_max, precio_min, precio_max) {
    // Convierte los valores a números enteros o null si no se proporcionan
    const annoMinNum = anno_min ? parseInt(anno_min) : null;
    const annoMaxNum = anno_max ? parseInt(anno_max) : null;
    const precioMinNum = precio_min ? parseInt(precio_min) : null;
    const precioMaxNum = precio_max ? parseInt(precio_max) : null;

    // Valida que los valores sean validos
    if (anno_min && (isNaN(annoMinNum) || annoMinNum < 0)) {
        return {
            error: "El año mínimo debe ser un número válido mayor o igual a 0"
        };
    }

    if (anno_max && (isNaN(annoMaxNum) || annoMaxNum < 0)) {
        return {
            error: "El año máximo debe ser un número válido mayor o igual a 0"
        };
    }

    if (precio_min && (isNaN(precioMinNum) || precioMinNum < 0)) {
        return {
            error: "El precio mínimo debe ser un número válido mayor o igual a 0"
        };
    }

    if (precio_max && (isNaN(precioMaxNum) || precioMaxNum < 0)) {
        return {
            error: "El precio máximo debe ser un número válido mayor o igual a 0"
        };
    }

    if (anno_min && anno_max && annoMinNum > annoMaxNum) {
        return {
            error: "El año mínimo no puede ser mayor al año máximo"
        };
    }

    if (precio_min && precio_max && precioMinNum > precioMaxNum) {
        return {
            error: "El precio mínimo no puede ser mayor al precio máximo"
        };
    }

    return { annoMinNum, annoMaxNum, precioMinNum, precioMaxNum };
}

// Valida que el estado del vehículo sea válido
function validarEstado(estado) {
    if (!estado) {
        return {};
    }

    const estadosValidos = ['Disponible', 'Vendido']; // Estados permitidos

    // Si el estado no es válido, devulve mensaje de error
    if (!estadosValidos.includes(estado)) {
        return {
            error: "Estado inválido"
        };
    }

    return {};
}

// Valida que los parámetros de la consulta sean correctos para los filtros, paginación
function validarFiltroVehiculos(query) {
    const { anno_min, anno_max, precio_min, precio_max, estado, page, limit } = query;

    // Valida paginación
    const paginacion = validarPaginacion(page, limit);
    if (paginacion.error) {
        return paginacion;
    }

    // Valida rangos de año y precio
    const rangos = validarRangos(anno_min, anno_max, precio_min, precio_max);
    if (rangos.error) {
        return rangos;
    }

    // Valida estado
    const estadoValidado = validarEstado(estado);
    if (estadoValidado.error) {
        return estadoValidado;
    }

    //Une los objetos en uno solo
    return {
        ...paginacion,
        ...rangos
    };
}

module.exports = validarFiltroVehiculos;