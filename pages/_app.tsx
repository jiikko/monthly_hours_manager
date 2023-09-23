import GitHubForkRibbon from 'react-github-fork-ribbon';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {AuthContext} from '../contexts/auth_context';
import {useAuth} from '../hooks/use_auth';
import '../styles/globals.css';

import type {NextPage} from 'next';
import type {AppProps} from 'next/app';

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
      <GitHubForkRibbon href="//github.com/jiikko/monthly_hours_manager" target="_blank" position="right-bottom">Fork me on GitHub</GitHubForkRibbon>
      {getLayout(<Component {...pageProps} />)}
      <ToastContainer />
    </AuthContext.Provider>
  )
}
