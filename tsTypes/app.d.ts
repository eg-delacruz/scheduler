interface KindeUser {
  id: string;
  email: string | null;
  given_name: string | null;
  family_name: string | null;
  picture: string | null;
}

interface SchedulerUser {
  name: string | null;
  id: string;
  email: string | null;
  created_at: Date;
  organizations: Organization[];
  current_organization: Organization | null;
}

interface Organization {
  id: string;
  name: string;
  type: string;
  created_by: string;
  created_at: Date;
  modified_at: Date;
  modified_by: string;
  days_available: { [key: string]: boolean };
  available_at_current_day: boolean;
  end_time: string;
  start_time: string;
  attached_meetings: number;
}

interface Meeting {
  id: string;
  organization_id: string;
  scheduler_user_id: string;
  created_by: string;
  created_at: Date;
  modified_at: Date;
  modified_by: string;
  status: 'scheduled' | 'unscheduled';
  duration: number;
  meeting_title: string;
  location_platform: string;
  location_url_phone: string;
  theme_color: string;
  organization_email: string;
  organization_name: string;
  formated_date: string;
  formated_timestamp: string;
  date: Date | null;
  time: string;
  appointee_email: string;
  appointee_name: string;
  appointee_note: string;
}
