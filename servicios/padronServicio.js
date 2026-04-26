// Servicio para consultar la validez de la cédula en el padrón nacional
const axios = require("axios");

const consultarCedula = async (cedula) => {
  try {
    // Realiza una solicitud al servidor del padrón
    const response = await axios.get(`http://localhost:8000/cedula/${cedula}`);

    // Si la solicitud es exitosa, devuelve los datos obtenidos del servidor
    return response.data;
    
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null; // no existe
    }
    throw error;
  }
};

module.exports = {
  consultarCedula
};