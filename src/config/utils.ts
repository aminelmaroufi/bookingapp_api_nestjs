import { Customer } from 'src/users/schemas/customer.schema';
import { User } from 'src/users/schemas/user.schema';

export const sanitazeUser = (user: User) => {
  const { _id, firstname, lastname, fullname, email, roles } = user;
  return { _id, firstname, lastname, fullname, email, roles };
};

export const sanitazeCustomer = (customer: Customer) => {
  const { _id, firstname, lastname, fullname, email, phone, roles, cards } =
    customer;
  return { _id, firstname, lastname, fullname, email, phone, roles, cards };
};
