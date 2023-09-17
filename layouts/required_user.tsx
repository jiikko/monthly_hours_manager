import { useCurrentUser } from 'hooks/use_current_user';

type Props = {
  children: React.ReactNode;
}

export function RequiredUser({ children }: Props) {
  const { user } = useCurrentUser();

  if(user === undefined) { return null }
  if(user === null) { return(<div className="alert alert-danger" role="alert">ログインが必要です。</div>) }

  return(
    <>
      {children}
    </>
  )
}
