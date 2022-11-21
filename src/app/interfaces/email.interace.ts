import { IEmailType } from "./email-type.interface";

export interface IEmail {
  _id: string;
  email_type: IEmailType;
  value: string;
};
