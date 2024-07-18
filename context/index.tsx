'use client';

import { createContext, useContext, useState } from 'react';

//TODO: add the meetings to the context
type Context = {
  SchedulerUser: SchedulerUser | null;
  setSchedulerUser: React.Dispatch<React.SetStateAction<SchedulerUser | null>>;
};

const AppContext = createContext<Context>({
  SchedulerUser: null,
  setSchedulerUser: () => {},
});

export function AppWrapper({ children }: { children: React.ReactNode }) {
  let [SchedulerUser, setSchedulerUser] = useState<SchedulerUser | null>(null);

  return (
    <AppContext.Provider value={{ SchedulerUser, setSchedulerUser }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
