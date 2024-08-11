import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {

  return (
    <Html lang='en'>
      <Head>
        {/* <link rel="stylesheet" href="https://unpkg.com/flowbite@1.4.4/dist/flowbite.min.css" /> */}
      </Head>
      <body className="text-white">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
