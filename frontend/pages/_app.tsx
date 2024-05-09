import '../styles/globals.css';

import { FC, useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';

import Head from 'next/head';
import { NextPage } from 'next';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';

import store from '@/common/modules/store';
import { getCurrentUser } from '@/common/modules/auth/services/auth-service';

export const meta = {
  title: 'Tourno-Bet',
  description: 'Tourno-Bet is a betting platform for tournaments',
};

type CustomNextPage = NextPage & {
  fullWidthHeader?: boolean;
  transparentHeaderOnTop?: boolean;
};

type CustomAppProps = AppProps & {
  Component: CustomNextPage;
};

const AppWrapper: FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    // @ts-ignore
    dispatch(getCurrentUser());
  }, []);

  return <>{children}</>;
};

const App = ({ Component, pageProps }: CustomAppProps) => {
  return (
    <Provider store={store}>
      <Head>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppWrapper>
        <Component {...pageProps} />
      </AppWrapper>
    </Provider>
  );
};

export default App;
