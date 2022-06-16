import * as functions from 'firebase-functions';
import { Firestore } from '@google-cloud/firestore';
import { Base64 } from 'js-base64';
import {
  CreateDeliveryRequest,
  DeliveryDomainModel,
  GetDeliveryResponse,
} from './delivery';
import { GetOptionsResponse, SetOptionsRequest } from './option';
import { v4 } from 'uuid';

let _db: Firestore;
const collectionName = 'info';
const queueName = 'queue';
const optionsName = 'options';

const db = () => {
  if (_db === undefined) {
    const tokenInfo = Base64.decode(functions.config().firestore.key);
    // const tokenInfo = Base64.decode(process.env.FIRESTORE_TOKEN || '');
    const tokenObject = JSON.parse(tokenInfo);
    // const tokenObject = require('./key.json');
    const clientEmail = tokenObject.client_email;
    const privateKey = tokenObject.private_key;

    _db = new Firestore({
      projectId: process.env.PROJECT_ID,
      ignoreUndefinedProperties: true,
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
    });
  }
  return _db;
};

export const getDeliveryByIndex = async (
  idx: number,
): Promise<GetDeliveryResponse> => {
  const document = await db().collection(collectionName).doc(queueName).get();
  const data = document.data() as { queue: DeliveryDomainModel[] };
  const a = data.queue[idx];
  return a;
};

export const createDeliveryEntry = async (
  delivery: CreateDeliveryRequest,
): Promise<GetDeliveryResponse> => {
  const document = await db().collection(collectionName).doc(queueName).get();
  const data = document.data() as { queue: DeliveryDomainModel[] };

  // Create new entry for DB
  const model = { ...delivery, id: v4() };
  data.queue.push(model);

  await db().collection(collectionName).doc(queueName).set(data);

  return model;
};

export const setDeliveredEntry = async (
  id: string,
): Promise<GetDeliveryResponse | undefined> => {
  const document = await db().collection(collectionName).doc(queueName).get();
  const data = document.data() as { queue: DeliveryDomainModel[] };

  // check if id exists in queue
  const idx = data.queue.findIndex((entry) => entry.id === id);
  if (idx === -1) {
    return undefined;
  } else {
    const deleted = data.queue.splice(idx, 1)[0];
    await db().collection(collectionName).doc(queueName).set(data);
    return deleted;
  }
};

export const getOptionsEntries = async (): Promise<GetOptionsResponse> => {
  const document = await db().collection(collectionName).doc(optionsName).get();
  const data = document.data() as { options: GetOptionsResponse };
  return data.options;
};

export const setOptionsEntries = async (
  options: SetOptionsRequest,
): Promise<GetOptionsResponse> => {
  await db().collection(collectionName).doc(optionsName).set({
    options: options,
  });
  return options;
};
