import Head from 'next/head';
import styles from '../styles/Home.module.css';

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

      <div className={styles.container}>
        <main>
          精算幅の時間管理くん(ヘッダーに移動する)
          {children}
        </main>
      </div>
    </>
  )
}
