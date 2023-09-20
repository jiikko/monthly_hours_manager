import { useContext } from 'react';
import { AuthContext} from 'contexts/auth_context'

export type Type = {
  user: any;
};

export const useCurrentUser = (): Type => {
  const { user } = useContext(AuthContext);

  return { user }
}
