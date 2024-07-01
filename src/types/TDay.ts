import { TDayFood } from "./TDayFood";

export type TDay = {
  id: string;
  order: number;
  sportActivity: string;
  userId: string;
  date?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  dayFoods: TDayFood[];
};
