const knex = require ('../database/knex');
const AppError = require('../utils/AppError');

class DishesController{
   async create(request, response) {
    
        const { title, description, price, ingredients } = request.body;
        
        const checkedDishAlreadyExists = await knex("dishes").where({ title }).first();

        if(checkedDishAlreadyExists){
          throw new AppError('Este prato já está cadastrado em nosso banco de')
        }
    
        //Inserindo a nota e recuperando o id da nota;
        const dish_id = await knex("dishes").insert({
          title,
          description,
          price,
          
        })
   
        const ingredientsInsert = ingredients.map(name => {
          return {
            name,   
            dish_id,
          }
        });
    
        await knex("ingredients").insert(ingredientsInsert)
    
        return response.json();
  }

  async update(request, response){
    const { title, description, price, ingredients } = request.body;
    const { id } = request.params;

    // Adicionando na constante dish o primeiro dado encontrado par ao id passado como params
    const dish = await knex("dishes").where({ id }).first();

    if(!dish){
        throw new AppError("O prato que você está tentando atualizar não existe")
    }

    dish.title = title ?? dish.title;
    dish.description = description ?? dish.description;
    dish.price = price ?? dish.price;

    await knex("dishes").where({ id }).update(dish)
    await knex("dishes").where({ id }).update("updated_at", knex.fn.now());

    const ingredientsInsert = ingredients.map(name => ({
      name,
      dish_id: dish.id

    }));

    
    await knex("ingredients").where({ dish_id: id}).delete()
    await knex("ingredients").insert(ingredientsInsert);

  
    return response.status(202).json('Prato atualizado com sucesso')

  }

  async delete(request, response){
    const { id } = request.params;

    await knex('dishes').where({ id }).delete();

    return response.json();
  } 

  async show(request, response){
    const { id } = request.params;
    const dish = await knex('dishes').where({ id }).first();
    const ingredients = await knex('ingredients').where({ dish_id: id }).orderBy('name');

    return response.json({
      ...dish,
      ingredients
    })
  }

  async index(request, response){
    const { title, ingredients } = request.query;

  
    let dishes;

    if(ingredients){
      const filterIngredients = ingredients.split(',').map(ingredient => ingredient.trim());
      
      dishes = await knex('ingredients')
      .select([
        'dishes.id',
        'dishes.title',
        'dishes.description',
        'dishes.price'
      ])
      .whereLike("dishes.title", `%${title}%`)
      .whereIn("name", filterIngredients)
      .innerJoin("dishes", "dishes.id", "ingredients.dish_id")
      .groupBy("dishes.id")
      .orderBy("dishes.title");
    }
    else{
      dishes = await knex('dishes')
      .whereLike('title', `%${title}%`)
      .orderBy('title')
    }

    const dishesIngredients = await knex("ingredients") 
    const dishesWithIngredients = dishes.map(dish => {
      const dishIngredient = dishesIngredients.filter(ingredient => ingredient.dish_id === dish.id);

      return {
        ...dish,
        ingredients: dishIngredient
      }
    })
      
    return response.json(dishesWithIngredients)
  }
  
}
module.exports = DishesController;
            
   

     



        

