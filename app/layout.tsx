import TanstackProvider from "@/context/tanstack-provider";
import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";


const numoniQuicksand = localFont({
  variable: '--numoni-quicksand',
  src: [
    {
      path: './fonts/Quicksand-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: './fonts/Quicksand-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/Quicksand-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fonts/Quicksand-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: './fonts/Quicksand-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
})

const numoniOpenSans = localFont({
  variable: '--numoni-opensans',
  src: [
    {
      path: './fonts/OpenSans-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: './fonts/OpenSans-LightItalic.ttf',
      weight: '300',
      style: 'italic',
    },
    {
      path: './fonts/OpenSans-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/OpenSans-Italic.ttf',
      weight: '400',
      style: 'italic',
    },
    {
      path: './fonts/OpenSans-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fonts/OpenSans-MediumItalic.ttf',
      weight: '500',
      style: 'italic',
    },
    {
      path: './fonts/OpenSans-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: './fonts/OpenSans-SemiBoldItalic.ttf',
      weight: '600',
      style: 'italic',
    },
    {
      path: './fonts/OpenSans-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: './fonts/OpenSans-BoldItalic.ttf',
      weight: '700',
      style: 'italic',
    },
    {
      path: './fonts/OpenSans-ExtraBold.ttf',
      weight: '800',
      style: 'normal',
    },
    {
      path: './fonts/OpenSans-ExtraBoldItalic.ttf',
      weight: '800',
      style: 'italic',
    },
  ],
})

export const metadata: Metadata = {
  title: { default: 'nuMoni', template: '%s | nuMoni' },
  description: "At nuMoni, we do things differently. We do not wait for you to spend to be appreciated. We reward your intention, not just your transaction. Get extra value upfront simply because you plan to spend.",
  authors: [{ name: 'nuMoni' }],
  creator: 'nuMoni',
  publisher: 'nuMoni',
  metadataBase: new URL('https://numoni.io'),
  openGraph: {
    title: 'nuMoni',
    description: 'At nuMoni, we do things differently. We do not wait for you to spend to be appreciated. We reward your intention, not just your transaction. Get extra value upfront simply because you plan to spend.',
    url: 'https://numoni.io',
    siteName: 'nuMoni',
  },
  icons: {
    icon: '/assets/icons/numoni-logo-light.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>

      </head>
      <body
        className={` ${numoniQuicksand.variable} ${numoniOpenSans.variable} antialiased`}
        suppressHydrationWarning
      >
        <TanstackProvider>
          {children}
        </TanstackProvider>
        <Script id="clarity-script-for-numoni-merchant-web" strategy="afterInteractive">
          {
            `
            (function(c,l,a,r,i,t,y){
            c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments) };
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "v9pwsr3f77");`
          }
        </Script>
      </body>
    </html>
  );
}


