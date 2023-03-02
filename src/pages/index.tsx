import Head from "next/head";
import { useEffect, useState } from "react";
import { utc } from "moment";
import styles from "@/styles/Home.module.css";

import {
  Configuration,
  LocationApiFactory,
  LocationDto,
  WeatherApiFactory,
  WeatherDto,
} from "@/api-client";

const locationApi = LocationApiFactory(
  new Configuration({
    basePath: process.env.NEXT_PUBLIC_BACKEND_URL,
  })
);

const weatherApi = WeatherApiFactory(
  new Configuration({
    basePath: process.env.NEXT_PUBLIC_BACKEND_URL,
  })
);

export default function Home() {
  const [locations, setLocations] = useState<LocationDto[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<number>(-1);
  const [weatherData, setWeatherData] = useState<WeatherDto[]>();

  useEffect(() => {
    (async () => {
      const {
        data: { locations: locationResponse },
      } = await locationApi.locationControllerGetLocations();
      setLocations(locationResponse);
    })();
  }, []);

  useEffect(() => {
    if (selectedLocation !== -1) {
      (async () => {
        const now = utc();
        const {
          data: { locations: locationsResponse },
        } = await weatherApi.forecastControllerGetWeather({
          startDate: now.format(),
          endDate: now.add(1, "d").format(),
          locationIds: [selectedLocation],
        });

        setWeatherData(locationsResponse[0].weather);
      })();
    }
  }, [selectedLocation]);

  return (
    <>
      <Head>
        <title>Weather App</title>
      </Head>
      <main className={styles.main}>
        <h3>Select city:</h3>
        <select
          value={selectedLocation}
          onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
            setSelectedLocation(Number(event.target.value));
          }}
        >
          {locations.map((location) => (
            <option key={location.id} value={location.id}>
              {location.name}, {location.countryCode}
            </option>
          ))}
        </select>
        {weatherData && (
          <div>
            <h3>Selected location weather</h3>
            {weatherData.map(
              ({
                timestamp,
                isNight,
                temperatureCelsius,
                humidity,
                precipitationProbability,
                pressure,
                weatherDescription,
                windDirection,
                windSpeedMetersPerSecond,
                rainVolumePast3HoursMm,
                snowVolumePast3HoursMm,
              }) => (
                <div key={timestamp}>
                  <span>timestamp: {timestamp}</span>
                  <span>temperatureCelsius: {temperatureCelsius}</span>
                </div>
              )
            )}
          </div>
        )}
      </main>
    </>
  );
}
