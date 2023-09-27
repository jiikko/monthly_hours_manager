import { AuthContext } from "contexts/auth_context";
import { User } from "firebase/auth";
import { useContext } from "react";

export type Type = {
  user: User;
};

export const useCurrentUser = (): Type => {
  const { user } = useContext(AuthContext);

  return { user };
};
