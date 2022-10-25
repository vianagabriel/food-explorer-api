const AppError = require('../utils/AppError');
const knex = require('../database/knex');

const { hash } = require('bcryptjs');

class UserController{
    async create(request, response){
     const { name, email, password, isAdmin } = request.body;
     const checkUsersExists = await knex('users').where({ email }).first();

     if(checkUsersExists){
       throw new AppError('Este email já está em uso')
     }

     const hashedPassword = await hash(password, 8) 

     await knex('users').insert({ name, email, password: hashedPassword , isAdmin})
     
     return response.status(201).json();
   }
};

module.exports = UserController;