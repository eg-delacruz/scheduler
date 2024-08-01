'use client';

import { createContext, useContext, useState } from 'react';

type Context = {
  SchedulerUser: SchedulerUser | null;
  setSchedulerUser: React.Dispatch<React.SetStateAction<SchedulerUser | null>>;
  CurrentMeetings: Meeting[];
  setCurrentMeetings: React.Dispatch<React.SetStateAction<Meeting[]>>;
};

const AppContext = createContext<Context>({
  SchedulerUser: null,
  setSchedulerUser: () => {},
  CurrentMeetings: [],
  setCurrentMeetings: () => {},
});

export function AppWrapper({ children }: { children: React.ReactNode }) {
  let [SchedulerUser, setSchedulerUser] = useState<SchedulerUser | null>(null);
  let [CurrentMeetings, setCurrentMeetings] = useState<Meeting[]>([]);

  return (
    <AppContext.Provider
      value={{
        SchedulerUser,
        setSchedulerUser,
        CurrentMeetings,
        setCurrentMeetings,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
