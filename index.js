require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const bodyParser = require("body-parser");

const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@as-integrations/express5');

const typeDefs = require('./graphql/esquema');
const resolvers = require('./graphql/resolvers');
const context = require('./graphql/contexto');



//Creación del servidor
const app = express();


//middleswares
app.use(bodyParser.json());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH']
}));


//Ruta para acceder a las imágenes
app.use('/imagenes', express.static('imagenes'));

//Rutas
app.use('/api', require('./rutas/vehiculos'));
app.use('/api', require('./rutas/autenticacion'));
app.use('/api', require('./rutas/pregunta'));
app.use('/api', require('./rutas/respuestas'));
app.use('/api', require('./rutas/conversacion'));
app.use('/api', require('./rutas/padron'));


async function iniciarServidor() {
    try {
        // Conexión a la BD
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Conexión a la BD exitosa');

        // Servidor Apollo GraphQL
        const apolloServer = new ApolloServer({
            typeDefs,
            resolvers
        });

        await apolloServer.start();

        app.use(
            '/graphql',
            express.json(),
            expressMiddleware(apolloServer, {
                context: async ({ req }) => context({ req })
            })
        );

        // Inicialización del servidor
        app.listen(process.env.PORT, () => {
            console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
            console.log(`GraphQL disponible en http://localhost:${process.env.PORT}/graphql`);
        });

    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
    }
}

iniciarServidor();