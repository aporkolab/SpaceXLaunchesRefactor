export interface LaunchSite {
  site_id: string;
  site_name: string;
  site_name_long: string;
}

export interface Links {
  article_link: string | null;
  video_link: string | null;
  mission_patch: string | null;
}

export interface Rocket {
  rocket_name: string;
  rocket_type: string;
}

export interface Telemetry {
  flight_club: string | null;
}

export interface Launch {
  id: string;
  details: string | null;
  is_tentative: boolean;
  launch_date_local: string;
  launch_date_unix: number;
  launch_date_utc: string;
  launch_site: LaunchSite;
  launch_success: boolean | null;
  launch_year: string;
  links: Links;
  mission_id: string[];
  mission_name: string;
  rocket: Rocket;
  static_fire_date_unix: number | null;
  static_fire_date_utc: string | null;
  telemetry: Telemetry;
  tentative_max_precision: string;
  upcoming: boolean;
}

export interface GqlError {
  message: string;
}

export interface GqlResponse {
  data: {
    launches: Launch[] | null;
  } | null;
  errors?: GqlError[];
}
