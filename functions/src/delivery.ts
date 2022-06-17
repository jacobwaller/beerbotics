import Joi from 'joi';

// Getting, Storing, and Retrieving Delivery Requests
export type CreateDeliveryRequest = {
  x: number;
  y: number;
  beerIndex: number;
  correlationId: string;
};

export type DeliveryDomainModel = CreateDeliveryRequest & {
  id: string;
  expiration: number;
};

export type GetDeliveryResponse = DeliveryDomainModel;

export const GetDeliveryRequestValidator = Joi.object<CreateDeliveryRequest>({
  x: Joi.number().required(),
  y: Joi.number().required(),
  beerIndex: Joi.number().integer().min(0).required(),
  correlationId: Joi.string().required(),
});
