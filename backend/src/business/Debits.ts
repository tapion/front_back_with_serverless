import { HealthIssues } from "src/types/HealthIssues";
import { PotentialCustomer } from "./interfaces/PotentialCustomer";

export const getDebits = (customer: PotentialCustomer, bmi: number): number => {
  try {
    return (
      getDebits_15(customer, bmi) +
      getDebits_25(customer, bmi) +
      getDebits_30(customer, bmi)
    );
  } catch (e) {
    throw {
      message:
        "We could not process this register, please validate the correct values",
    };
  }
};

const getDebits_15 = (customer: PotentialCustomer, bmi: number): number => {
  const debits = 15;
  let totalDebits = 0;
  totalDebits += hasHelthIssues(HealthIssues.ANXIETY, customer) ? debits : 0;
  totalDebits += hasHelthIssues(HealthIssues.DEPRESSION, customer) ? debits : 0;
  totalDebits += bmi < 18.5 ? debits : 0;
  return totalDebits;
};

const getDebits_25 = (customer: PotentialCustomer, bmi: number): number => {
  const debits = 25;
  let totalDebits = 0;
  totalDebits += hasHelthIssues(HealthIssues.SURGERY, customer) ? debits : 0;
  totalDebits += customer.hasSmoked ? debits : 0;
  totalDebits += (bmi > 25 && bmi <= 30) ? debits : 0;
  totalDebits += (customer.alcohol > 10 && customer.alcohol <= 25) ? debits : 0;
  return totalDebits;
};

const getDebits_30 = (customer: PotentialCustomer, bmi: number): number => {
  const debits = 30;
  let totalDebits = 0;
  totalDebits += hasHelthIssues(HealthIssues.HEART, customer) ? debits : 0;
  totalDebits += bmi > 30 ? debits : 0;
  totalDebits += customer.alcohol > 25 ? debits : 0;
  return totalDebits;
};

const hasHelthIssues = (
  issue: HealthIssues,
  customer: PotentialCustomer
) => {
  if (customer.health.length <= 0) return false;
  return customer.health.includes(issue);
};
