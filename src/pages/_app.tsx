import { store } from "@/redux/store";
import { ThemeProvider } from "@/components/theme-provider";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Fira_Sans } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";

const firaSans = Fira_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-fira-sans",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={firaSans.className}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <Provider store={store}>
          <Toaster />
          <Component {...pageProps} />
        </Provider>
      </ThemeProvider>
    </main>
  );
}
