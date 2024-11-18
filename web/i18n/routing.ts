import { defineRouting } from 'next-intl/routing';
import { createSharedPathnamesNavigation } from 'next-intl/navigation';

//@ts-ignore
export const routing = defineRouting({
    locales: ['en', 'fr'],
    defaultLocale: 'en'
});
//@ts-ignore
export const { Link, redirect, usePathname, useRouter } = createSharedPathnamesNavigation(routing);
