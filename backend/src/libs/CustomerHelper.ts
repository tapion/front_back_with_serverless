import { PotentialCustomer } from "src/business/interfaces/PotentialCustomer";

export const createCustomer = (data: any): PotentialCustomer => {
  return {
    name: data.name,
    age: parseInt(data.age),
    gender: data.gender,
    smoker: data.smoker,
    email: data.email,
    height: parseInt(data.height),
    weight: parseInt(data.weight),
    health: data.health.replace("[", "").replace("]", "").split(","),
    alcohol: parseInt(data.alcohol),
    postalcode: data.postalcode,
    policyrequested: parseInt(data.policyrequested),
    hasSmoked: data.smoker == "S",
  };
};
