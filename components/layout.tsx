import Head from 'next/head';
import { useRouter } from 'next/router';
import styles from '../styles/Home.module.css';
import { CalendarDate } from '../lib/calendar_date';
import { Container, Col, Row, Nav, Navbar, NavDropdown } from 'react-bootstrap';

type LayoutProps = {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const { year, month, ...rest } = router.query; // パスパラメータは除外する
  // NOTE: const queryParameters = new URLSearchParams(router.query).toString()だとtype errorになるので
  const queryParameters = new URLSearchParams(Object.fromEntries(Object.entries(rest).map(([key, val]) => [key, String(val)]))).toString();
  const date = CalendarDate();

  return (
    <>
      <Head>
        <title>精算幅の時間管理くん</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href={`/?${queryParameters}`}>精算幅時間管理くん</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
            <Nav.Link href={`/edit?${queryParameters}`}>カレンダーを編集する</Nav.Link>
            <Nav.Link href={`/current_month?${queryParameters}`}>今月を表示する</Nav.Link>
            <Nav.Link href={`/${date.year()}/${date.month()}?${queryParameters}`}>今月を表示する(2)</Nav.Link>
            <Nav.Link href={`/${date.year()}/${date.nextMonth()}?${queryParameters}`}>来月を表示する(2)</Nav.Link>
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
