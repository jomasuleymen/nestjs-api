import { User } from "src/user/user.model";

type UserDTO = Omit<User, "password">;

export default UserDTO;
