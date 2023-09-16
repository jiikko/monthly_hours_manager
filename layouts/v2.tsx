import Head from 'next/head';
import { useRouter } from 'next/router';
import { CalendarDate } from '../lib/calendar_date';
import { Container, Row, Nav, Navbar } from 'react-bootstrap';
import { PathGenerator } from '../lib/path_generator';
import { useAuth } from '../hooks/use_auth';
import { AuthContext } from '../contexts/auth_context';
import { useContext } from 'react';

type LayoutProps = {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const { year, month, ...rest } = router.query; // パスパラメータは除外する
  // NOTE: const queryParameters = new URLSearchParams(router.query).toString()だとtype errorになるので
  const queryParameters = new URLSearchParams(Object.fromEntries(Object.entries(rest).map(([key, val]) => [key, String(val)]))).toString();
  const date = CalendarDate();
  const pathGenerator = PathGenerator()
  const rootPath = pathGenerator.rootPath(queryParameters)
  const editPath = pathGenerator.editPath(queryParameters)
  const loginPath = pathGenerator.loginPath(queryParameters)
  const { logout } = useAuth();
  const { user } = useContext(AuthContext);
  const loggedInEmail = user && user.email;
  const logged = !!loggedInEmail;
  const loaded = user !== undefined;

  const handleLogout = async () => {
    logout();
    alert('ログアウトしました');
    document.location = '/';
  }

  return (
    <>
      <Head>
        <title>月の時間管理くん(v2)</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href={'/v2'}>月の時間管理くん(v2)</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href={'/v2/calendars'}>カレンダー一覧</Nav.Link>
              <Nav.Link onClick={handleLogout} >{loaded && logged && 'ログアウトする'}</Nav.Link>
              <Nav.Link href={loginPath}>{loaded && !logged && 'ログインする'}</Nav.Link>
            </Nav>
            <Nav>
              <Nav.Link href="#" onClick={() => { return false }}>
                {logged && <><b>{loggedInEmail}</b>でログインしています</>}
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container>
        <Row className="justify-content-md-between p-3">
          {children}
        </Row>
      </Container>
    </>
  )
}
