export class UserDto {
  _id?: string;
  firstname: string;
  lastname: string;
  fullname: string;
  email: string;
  phone: string;
  cards: Array<string>;
  roles: Array<string>;
}
