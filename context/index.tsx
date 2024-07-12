"use client";

import { createContext, useContext, useState } from "react";

type Context = {
  SchedulerUser: SchedulerUser | null;
  setContext: React.Dispatch<React.SetStateAction<SchedulerUser | null>>;
};

const AppContext = createContext<Context>({
  SchedulerUser: null,
  setContext: () => {},
});

export function AppWrapper({ children }: { children: React.ReactNode }) {
  let [state, setState] = useState<SchedulerUser | null>(null);

  return (
    <AppContext.Provider value={{ SchedulerUser: state, setContext: setState }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
