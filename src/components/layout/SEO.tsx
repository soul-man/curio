import Head from 'next/head';
import { useRouter } from 'next/router';

import { siteConfig } from '@/constant/config';

type SeoProps = {
  date?: string;
  templateTitle?: string;
} & Partial<typeof siteConfig>;

export default function Seo(props: SeoProps) {
  const router = useRouter();
  const meta_app = {
    ...siteConfig,
    ...props,
  };
  siteConfig['title'] = props.templateTitle
    ? `${props.templateTitle} | ${meta_app.description}`
    : siteConfig.title;

  return (
    <Head>
      <title>{siteConfig.title}</title>
      <meta content={siteConfig.description} name='description' />
      <meta property='og:url' content={`${siteConfig.url}${router.asPath}`} />
      <link rel='canonical' href={`${siteConfig.url}${router.asPath}`} />
      <meta property='og:description' content={siteConfig.description} />
      <meta property='og:title' content={siteConfig.title} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <meta name="robots" content="index,follow" />
      {favicons.map((linkProps) => (
        <link key={linkProps.href} {...linkProps} />
      ))}
      <meta name='msapplication-TileColor' content='#ffffff' />
      <meta name='msapplication-config' content='/favicon/browserconfig.xml' />
      <meta name='theme-color' content='#ffffff' />
      <meta name="google-site-verification" content="Udiy3P7OOSu5k7Nj6OLOleL-NXF8iJ9yLMV5iUDXiS8" />
    </Head>
  );
}

const favicons: Array<React.ComponentPropsWithoutRef<'link'>> = [
  {
    rel: 'apple-touch-icon',
    sizes: '180x180',
    href: '/favicon/apple-touch-icon.png',
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '32x32',
    href: '/favicon/favicon-32x32.png',
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '16x16',
    href: '/favicon/favicon-16x16.png',
  },
  { rel: 'manifest', href: '/favicon/site.webmanifest' },
  {
    rel: 'mask-icon',
    href: '/favicon/safari-pinned-tab.svg',
    color: '#00e887',
  },
  { rel: 'shortcut icon', href: '/favicon/favicon.ico' },
];
