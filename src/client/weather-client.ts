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
    const res = await fetch(
      `${this.baseUrl}/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&format=json&timeformat=unixtime`,
    );
    if (res.status != 200) {
      throw Error(`getHourly returned status ${res.status}`);
    }
    return await res.json();
  }
}
