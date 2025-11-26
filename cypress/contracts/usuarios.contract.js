import Joi from "joi";

const usuariosSchema = Joi.object({
quantidade: Joi.number(),
  usuarios: Joi.array().items(
    Joi.object({
      nome: Joi.string().required(),
      email: Joi.string().required(),
      password: Joi.string().required(),
      administrador: Joi.string().required(),
      _id: Joi.string().required()
    })
  )
});

export default usuariosSchema;
