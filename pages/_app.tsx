import '../styles/globals.css'
import { AuthContext} from '../contexts/auth_context'
import { useAuth } from '../hooks/use_auth';

import type { NextPage } from 'next'
import type { AppProps } from 'next/app'

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: React.ReactElement) => React.ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const { user } = useAuth();
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page)

  return (
    <AuthContext.Provider value={{ user }}>
      {getLayout(<Component {...pageProps} />)}
    </AuthContext.Provider>
  )
}
