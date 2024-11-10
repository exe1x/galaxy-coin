import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Generative Solar System",
  description: "Generative Solar System ($GSS) is an innovative platform that transforms blockchain data into an interactive, real-time celestial visualization. Each user or transaction is represented as a unique, orbiting entity within a generative galaxy, providing users with a visually engaging and intuitive way to explore blockchain activity. Designed for professionals and enthusiasts alike, $GSS combines cutting-edge data visualization techniques with a sleek, space-themed interface. Experience blockchain like never before—observe your assets in motion, track trends, and gain insights from a universe of interconnected data points. Generative Solar System: where data meets the cosmos.",
  icons: {
    icon: '/gss.jpg', // Path relative to 'public' directory
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
