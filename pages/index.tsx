import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Layout from '../components/layout';
import { JsonParameter } from '../lib/json_parameter';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { About } from '../components/about';

export default function Page() {
  const router = useRouter();
  const jsonObject = JsonParameter.parse(Object.fromEntries(Object.entries(router.query).map(([key, val]) => [key, String(val)])));

  return (
    <Layout>
      <About jsonObject={jsonObject} />
    </Layout>
  )
}
