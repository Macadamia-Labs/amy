import { Crimson_Pro, Manrope } from 'next/font/google'
import localFont from 'next/font/local'

export const fontSans = Manrope({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap'
})

export const fontSerif = Crimson_Pro({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap'
})

export const fontHeading = localFont({
  variable: '--font-heading',
  src: [
    {
      path: '../public/fonts/recoleta-regular.otf',
      weight: '400',
      style: 'normal'
    },
    {
      path: '../public/fonts/recoleta-bold.otf',
      weight: '700',
      style: 'normal'
    },
    {
      path: '../public/fonts/recoleta-black.otf',
      weight: '900',
      style: 'normal'
    }
  ]
})

export const fontMono = localFont({
  src: '../public/fonts/GeistMonoVF.woff',
  variable: '--font-mono',
  weight: '100 900'
})
