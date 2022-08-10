import { Gender } from "src/types/Gender";
import { HealthIssues } from "src/types/HealthIssues";

export interface PotentialCustomer {
  age: number;
  gender: Gender;
  height: number;
  weight: number;
  health: HealthIssues[];
  alcohol: number;
  policyrequested: number;
  smoker: "S" | "NS";
  hasSmoked: boolean;
  name: string;
  email: string;
  postalcode: string;
}
