import { AbstractIntlMessages, NextIntlClientProvider } from 'next-intl';
import { NextUIProvider } from "@nextui-org/react";
import { getMessages } from 'next-intl/server';
import { ReactNode } from 'react';
import "./globals.css";

interface Props {
  children: ReactNode;
  params: { locale: string };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: Props) {
  const messages: AbstractIntlMessages = await getMessages();

  return (
    <html>
      <body lang={locale}>
        <NextUIProvider>
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
        </ NextUIProvider>
      </body>
    </html>
  );
}