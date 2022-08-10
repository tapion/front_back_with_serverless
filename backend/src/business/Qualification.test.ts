import { Gender } from "src/types/Gender";
import { getQualification } from "./Qualification";
import { PotentialCustomer } from "./interfaces/PotentialCustomer";
import { HealthIssues } from "src/types/HealthIssues";

describe("Validate Qualifications", () => {
  const customer: PotentialCustomer = {
    age: 30,
    gender: Gender.MALE,
    height: 170,
    weight: 70,
    health: [],
    alcohol: 0,
    policyrequested: 400000,
    smoker: "NS",
    hasSmoked: false,
    name: "Perfect Score",
    email: "score@perfect.com",
    postalcode: "H1S 3Y3",
  };

  const responseExpected = {
    name: "Perfect Score",
    BMI: 24.22,
    score: 0,
    needInterview: false,
    monthlyFee: 3333.33,
    riskLevel: 0,
  };

  test("BMI", async () => {
    const result = getQualification(customer);
    expect(responseExpected).toStrictEqual(result);
  });

  test("Smoke Famle age between 18 and 40", async () => {
    const newCustomer = {
      ...customer,
      hasSmoked: true,
      health: [HealthIssues.HEART],
    };
    const newExpected = {
      ...responseExpected,
      monthlyFee: 8333.33,
      score: 55,
      needInterview: true,
    };
    const result = getQualification(newCustomer);
    expect(newExpected).toStrictEqual(result);
  });

  test("Require an interview", async () => {
    const newCustomer = {
      ...customer,
      hasSmoked: true,
      gender: Gender.FEMALE,
      weight: 100,
    };
    const newExpected = {
      ...responseExpected,
      monthlyFee: 8333.33,
      score: 55,
      needInterview: true,
      BMI: 34.6,
    };
    const result = getQualification(newCustomer);
    expect(newExpected).toStrictEqual(result);
  });
  test("Charged with 1.15X", async () => {
    const newCustomer = {
      ...customer,
      hasSmoked: true,
      gender: Gender.FEMALE,
      health: [HealthIssues.HEART],
      alcohol: 26,
    };
    const newExpected = {
      ...responseExpected,
      monthlyFee: 9583.33,
      score: 85,
      riskLevel: 1,
      needInterview: true,
    };
    const result = getQualification(newCustomer);
    expect(newExpected).toStrictEqual(result);
  });
  test("Charged with 1.25X", async () => {
    const newCustomer = {
      ...customer,
      hasSmoked: true,
      gender: Gender.FEMALE,
      health: [HealthIssues.HEART, HealthIssues.SURGERY],
      alcohol: 26,
    };
    const newExpected = {
      ...responseExpected,
      monthlyFee: 10416.67,
      score: 110,
      riskLevel: 2,
      needInterview: true,
    };
    const result = getQualification(newCustomer);
    expect(newExpected).toStrictEqual(result);
  });
  test("Score not found", async () => {
    const newCustomer = { ...customer, age: 100 };
    expect(() => getQualification(newCustomer)).toThrow(
      "There are not score configuration for this customer"
    );
  });
});
