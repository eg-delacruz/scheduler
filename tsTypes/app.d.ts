interface BusinessInfo {
  businessName: string;
  daysAvailable: { [day: string]: string };
  email: string;
  endTime: string;
  startTime: string;
  userName: string;
}

interface MeetingEvent {
  businesssId: unknown;
  createdBy: string;
  duration: number;
  eventName: string;
  id: string;
  locationType: string;
  locationUrl: string;
  themeColor: string;
}
