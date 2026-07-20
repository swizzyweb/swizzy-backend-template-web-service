const FETCH_TIMEOUT_MS = 5000;

export interface IWeatherClient {
  getHourly(request: { latitude: number; longitude: number }): Promise<any>;
}

export interface WeatherClientProps {
  baseUrl?: string;
}

export class OpenMeteoWeatherClient implements IWeatherClient {
  private baseUrl: string;
  constructor(props: WeatherClientProps) {
    this.baseUrl = props.baseUrl ?? "https://api.open-meteo.com";
  }

  async getHourly(request: {
    latitude: number;
    longitude: number;
  }): Promise<any> {
    const { latitude, longitude } = request;
    const url = new URL(`${this.baseUrl}/v1/forecast`);
    url.searchParams.set("latitude", String(latitude));
    url.searchParams.set("longitude", String(longitude));
    url.searchParams.set("hourly", "temperature_2m");
    url.searchParams.set("format", "json");
    url.searchParams.set("timeformat", "unixtime");
    const res = await fetch(url, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!res.ok) {
      throw new Error(`getHourly returned status ${res.status}`);
    }
    return res.json();
  }
}
