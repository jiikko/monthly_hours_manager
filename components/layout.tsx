import Head from 'next/head';
import styles from '../styles/Home.module.css';

import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';

type LayoutProps = {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Head>
        <title>精算幅の時間管理くん</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="/">精算幅時間管理くん</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/calendar_edit">カレンダーを編集する</Nav.Link>
            <Nav.Link href="#">今月を表示する</Nav.Link>
            <Nav.Link href="#">来月を表示する</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    {children}
    </>
  )
}
