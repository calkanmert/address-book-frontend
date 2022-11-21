import { IPhoneType } from "./phone-type.interface";

export interface IPhone {
  _id: string;
  phone_type: IPhoneType;
  value: string;
};
