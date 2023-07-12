import { User } from 'src/users/schemas/user.schema';

export const sanitazeUser = (user: User) => {
  const { _id, firstname, lastname, fullname, email } = user;
  return { _id, firstname, lastname, fullname, email };
};
