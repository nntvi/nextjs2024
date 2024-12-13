"use client";
import { isClient } from "@/lib/http";
// import { clientSessionToken } from "@/lib/http";
import { AccountResType } from "@/schemaValidations/account.schema";
import { useLayoutEffect, useState, createContext, useContext } from "react";

type User = AccountResType["data"];
const AppContext = createContext<{
  user: User | null;
  setUser: (user: User | null) => void;
}>({
  user: null,
  setUser: () => {},
});
export const useAppContext = () => {
  const context = useContext(AppContext);
  return context;
};

export default function AppProvider({
  children,
  // initialSessionToken = "",
  user: userProp,
}: {
  children: React.ReactNode;
  // initialSessionToken: string;
  user?: User | null;
}) {
  const [user, setUser] = useState<User | null>(userProp || null);
  // useState(() => {
  //   if (isClient()) {
  //     clientSessionToken.value = initialSessionToken;
  //   }
  // });

  return (
    <AppContext.Provider value={{ user, setUser }}>
      {children}
    </AppContext.Provider>
  );
}
