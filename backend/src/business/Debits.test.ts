import { Gender } from "src/types/Gender";
import { HealthIssues } from "src/types/HealthIssues";
import { getDebits } from "./Debits";
import { PotentialCustomer } from "./interfaces/PotentialCustomer";

describe("Validate all debit's rules", () => {
  const customer: PotentialCustomer = {
    age: 30,
    gender: Gender.MALE,
    height: 170,
    weight: 90,
    health: [],
    alcohol: 0,
    policyrequested: 400000,
    smoker: "NS",
    hasSmoked: false,
    name: "Perfect Score",
    email: "score@perfect.com",
    postalcode: "H1S 3Y3",
  };

  const BMI = 20;

  test("Get 0 debits perfect score", async () => {
    const BMI = 20;
    const result = getDebits(customer, BMI);
    expect(0).toBe(result);
  });

  test("Get 15-debits rule", async () => {
    const customerForTest = {
      ...customer,
      health: [HealthIssues.DEPRESSION, HealthIssues.ANXIETY],
    };
    const result = getDebits(customerForTest, BMI);
    expect(30).toBe(result);
  });
  test("Get 15-debits BMI less than expected", async () => {
    const BMI_forTest = 17;
    const result = getDebits(customer, BMI_forTest);
    expect(15).toBe(result);
  });
  test("Get 25-debits health issues", async () => {
    const customerForTest = { ...customer, health: [HealthIssues.SURGERY] };
    const result = getDebits(customerForTest, BMI);
    expect(25).toBe(result);
  });
  test("Get 25-debits alcohol comsumption", async () => {
    const customerForTest = { ...customer, alcohol: 11, hasSmoked: true };
    const result = getDebits(customerForTest, BMI);
    expect(50).toBe(result);
  });
  test("Get 30-debits BMI unexpected", async () => {
    const BMI_forTest = 31;
    const result = getDebits(customer, BMI_forTest);
    expect(30).toBe(result);
  });
  test("Get 30-debits alcohol comsumption", async () => {
    const customerForTest = {
      ...customer,
      health: [HealthIssues.HEART],
      alcohol: 30,
    };
    const result = getDebits(customerForTest, BMI);
    expect(60).toBe(result);
  });
  test("Get Max debits", async () => {
    const customerForTest = {
      ...customer,
      health: [
        HealthIssues.SURGERY,
        HealthIssues.ANXIETY,
        HealthIssues.HEART,
        HealthIssues.DEPRESSION,
      ],
      hasSmoked: true,
      alcohol: 40,
    };
    const BMI_forTest = 31;
    const result = getDebits(customerForTest, BMI_forTest);
    expect(170).toBe(result);
  });
});
