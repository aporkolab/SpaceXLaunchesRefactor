import { Launch } from '../app/core/models/launch.model';

export function makeLaunch(overrides: Partial<Launch> = {}): Launch {
  return {
    id: '1',
    details: null,
    is_tentative: false,
    launch_date_local: '2006-03-25T10:30:00+12:00',
    launch_date_unix: 1143239400,
    launch_date_utc: '2006-03-24T22:30:00.000Z',
    launch_site: { site_id: 'kwajalein_atoll', site_name: 'Kwajalein Atoll', site_name_long: 'Kwajalein Atoll Omelek Island' },
    launch_success: false,
    launch_year: '2006',
    links: { article_link: null, video_link: null, mission_patch: null },
    mission_id: [],
    mission_name: 'FalconSat',
    rocket: { rocket_name: 'Falcon 1', rocket_type: 'Merlin A' },
    static_fire_date_unix: null,
    static_fire_date_utc: null,
    telemetry: { flight_club: null },
    tentative_max_precision: 'hour',
    upcoming: false,
    ...overrides,
  };
}
