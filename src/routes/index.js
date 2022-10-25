const { Router } = require('express');
const routes = Router();

const userRoutes = require('./user.routes');
const dishesRoutes = require('./dish.routes');



routes.use('/users', userRoutes);
routes.use('/dishes', dishesRoutes);

module.exports = routes;