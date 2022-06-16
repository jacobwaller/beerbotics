import * as functions from 'firebase-functions';

import {
  createDeliveryEntry,
  getDeliveryByIndex,
  getOptionsEntries,
  setDeliveredEntry,
  setOptionsEntries,
} from './dbHandler';
import { IndexValidator, UuidValidator } from './simpleValidators';
import { GetDeliveryRequestValidator } from './delivery';
import { SetOptionsValidator } from './option';

export const getDelivery = functions.https.onRequest(async (req, res) => {
  const strIndex = req.path.split('/')[1];
  const index = parseInt(strIndex);
  const validator = IndexValidator.validate(index);

  if (validator.error) {
    res.status(400).send(validator.error.message);
  } else {
    const delivery = await getDeliveryByIndex(index);
    if (delivery) {
      res.status(200).send(delivery);
    } else {
      res.status(404).send(`Could not find delivery with index ${index}`);
    }
  }
});

export const setDelivered = functions.https.onRequest(async (req, res) => {
  const id = req.path.split('/')[2];
  const validator = UuidValidator.validate(id);

  if (validator.error) {
    res.status(400).send(validator.error.message);
  } else {
    const delivery = await setDeliveredEntry(id);
    if (delivery) {
      res.status(200).send(delivery);
    } else {
      res.status(404).send(`Could not find delivery with id ${id}`);
    }
  }
});

export const createDelivery = functions.https.onRequest(async (req, res) => {
  const validator = GetDeliveryRequestValidator.validate(req.body);
  if (validator.error) {
    res.status(400).send(validator.error.message);
  } else {
    const delivery = await createDeliveryEntry(req.body);
    res.status(200).send(JSON.stringify(delivery));
  }
});

export const getOptions = functions.https.onRequest(async (req, res) => {
  const options = await getOptionsEntries();
  res.status(200).send(options);
});

export const setOptions = functions.https.onRequest(async (req, res) => {
  const validator = SetOptionsValidator.validate(req.body);
  if (validator.error) {
    res.status(400).send(validator.error.message);
  } else {
    const options = await setOptionsEntries(req.body);
    res.status(200).send(options);
  }
});

// export default handler;

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
