import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import HeaderComponent from "@/components/ui/header";
import { Toaster } from "@/components/ui/toaster";
import AppProvider from "@/app/AppProvider";
// import { cookies } from "next/headers";
import SlideSession from "@/components/slide-session";
import accountApiRequest from "@/apiRequests/account";
import { AccountResType } from "@/schemaValidations/account.schema";
import { baseOpenGraph } from "@/app/shared-metadata";

const inter = Inter({ subsets: ["vietnamese"] });

export const metadata: Metadata = {
  title: {
    template: "%s | Producto",
    default: "Producto",
  },
  description: "Created by Vi Aibi",
  openGraph: baseOpenGraph,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const cookieStore = cookies();
  // const sessionToken = cookieStore.get("sessionToken")?.value;
  let user: AccountResType["data"] | null = null;
  // if (sessionToken) {
  //   const data = await accountApiRequest.me(sessionToken);
  //   user = data.payload.data;
  // }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AppProvider
            // initialSessionToken={sessionToken || ""}
            user={user}
          >
            <HeaderComponent user={user} />
            {children}
            <SlideSession />
          </AppProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
