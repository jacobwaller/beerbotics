import Joi from 'joi';

// Getting and setting options
export type BeerDomainModel = {
  name: string;
  abv: number;
  remaining: number;
};
export type SetOptionsRequest = BeerDomainModel[];
export type GetOptionsResponse = BeerDomainModel[];

export const SetOptionsValidator = Joi.array()
  .items(
    Joi.object<BeerDomainModel>({
      name: Joi.string().required(),
      abv: Joi.number().min(0).max(100).required(),
      remaining: Joi.number().integer().min(0).required(),
    }),
  )
  .min(1);
