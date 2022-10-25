const { Router } = require('express');
const dishesRoutes = Router();
const DishesController = require('../controllers/dishesController');
const dishesController = new DishesController();

dishesRoutes.post('/', dishesController.create);
dishesRoutes.put('/:id', dishesController.update);
dishesRoutes.delete('/:id', dishesController.delete);
dishesRoutes.get('/:id', dishesController.show);
dishesRoutes.get('/', dishesController.index);

module.exports = dishesRoutes;