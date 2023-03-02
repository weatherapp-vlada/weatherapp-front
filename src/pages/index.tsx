import Head from "next/head";
import { useEffect, useState } from "react";
import { utc } from "moment";
import { match, P } from "ts-pattern";
import { AsyncData, Option, Result } from "@swan-io/boxed";

import styles from "@/styles/Home.module.css";
import {
  Configuration,
  LocationApiFactory,
  LocationDto,
  WeatherApiFactory,
  WeatherDto,
} from "@/api-client";

const { NotAsked, Loading, Done } = AsyncData.pattern;
const { Ok, Error } = Result.pattern;
const { Some, None } = Option.pattern;

type LocationsState = AsyncData<Result<Option<LocationDto[]>, number>>;
type WeatherDataState = AsyncData<Result<Option<WeatherDto[]>, number>>;

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
  const [locations, setLocations] = useState<LocationsState>(
    AsyncData.NotAsked()
  );
  const [selectedLocation, setSelectedLocation] = useState<
    number | undefined
  >();
  const [weatherData, setWeatherData] = useState<WeatherDataState>(
    AsyncData.NotAsked()
  );

  useEffect(() => {
    setLocations(AsyncData.Loading());
    locationApi
      .locationControllerGetLocations()
      .then(({ data: { locations: locationsResponse } }) =>
        setLocations(
          AsyncData.Done(Result.Ok(Option.fromNull(locationsResponse)))
        )
      )
      .catch((err) => setLocations(AsyncData.Done(Result.Error(err))));
  }, []);

  useEffect(() => {
    if (selectedLocation !== undefined) {
      setWeatherData(AsyncData.Loading());
      const now = utc();
      weatherApi
        .forecastControllerGetWeather({
          startDate: now.format(),
          endDate: now.add(1, "d").format(),
          locationIds: [selectedLocation],
        })
        .then(({ data: { locations: locationsResponse } }) =>
          setWeatherData(
            AsyncData.Done(
              Result.Ok(Option.fromNull(locationsResponse[0].weather))
            )
          )
        )
        .catch((err) => setWeatherData(AsyncData.Done(Result.Error(err))));
    }
  }, [selectedLocation]);

  return (
    <>
      <Head>
        <title>Weather App</title>
      </Head>
      <main className={styles.main}>
        {match(locations)
          .with(NotAsked, Loading, () => null)
          .with(
            Done(Error(P.any)),
            () => "An error occurred while retrieving supported locations"
          )
          .with(Done(Ok(None)), () => "No locations was received")
          .with(Done(Ok(Some(P.select()))), (locations) => (
            <div>
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
            </div>
          ))
          .exhaustive()}

        {match(weatherData)
          .with(NotAsked, Loading, () => null)
          .with(
            Done(Error(P.any)),
            () =>
              "An error occurred while retrieving weather data for selected location"
          )
          .with(Done(Ok(None)), () => "No weather data was received")
          .with(Done(Ok(Some(P.select()))), (weatherData) => (
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
          ))
          .exhaustive()}
      </main>
    </>
  );
}
