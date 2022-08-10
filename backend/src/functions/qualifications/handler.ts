import { formatJSONResponse } from "@libs/api-gateway";
import { createCustomer } from "@libs/CustomerHelper";
import { middyfy } from "@libs/lambda";
import { getQualification } from "src/business/Qualification";
import { Readable } from "stream";
import * as Joi from "joi";
import { CustomerErrors } from "src/types/Errors";

const csv = require("csv-parser");
const responses = [];
const errors :CustomerErrors[] = [];

const schema = Joi.object({
  name: Joi.string().min(3).required(),
  age: Joi.string().min(2).max(3).required(),
  gender: Joi.string().min(1).max(1).required(),
  smoker: Joi.string().min(1).max(2).required(),
  email: Joi.string().email().required(),
  height: Joi.string().min(2).required(),
  weight: Joi.string().min(2).required(),
  health: Joi.string().min(2).required(),
  alcohol: Joi.string().min(1).required(),
  postalcode: Joi.string().min(1).required(),
  policyrequested: Joi.string().min(6).required(),
});
const qualifiteCustomers = async (event) => {
  console.log("el evento", event.body);
  try {
    await readCSV(event.body);
  } catch(e) { }
  console.log("responses", responses);
  return formatJSONResponse({
    responses,
    errors,
  });
};

const readCSV = async (fileName: string) => {
  const s = new Readable();
  s._read = () => {};
  s.push(fileName);
  s.push(null);
  return new Promise((resolve, reject) => {
    s.pipe(csv())
      .on("data", async (product) => {
        try {
          console.log("Este es el producto", product);
          const validate = schema.validate(product);
          if (!validate.error) {
            const consumer = createCustomer(product);
            const data = getQualification(consumer);
            responses.push(data);
          } else {
            throw {message: validate.error.message};
          }
        } catch (e) {
          errors.push({
            name: product?.name,
            message: e.message,
          });
          reject();
        }
      })
      .on("end", resolve)
      .on("error", () => {
        console.log("****Un error!!!");
      });
  });
};

export const main = middyfy(qualifiteCustomers);
