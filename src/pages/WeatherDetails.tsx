import { useState } from "react";
import { utc } from "moment";
import Image from "next/image";

import { LocationWeatherDto, WeatherDto } from "@/api-client";
import WeatherGraph from "./WeatherGraph";

export default function WeatherDetails({
  data: { location, countryCode, weather },
}: {
  data: LocationWeatherDto;
}) {
  const [selectedTimeWeatherData, setSelectedTimeWeatherData] =
    useState<WeatherDto>(weather[0]);

  const onSelectedTimeChange = (value: string) => {
    setSelectedTimeWeatherData(
      weather.find((item) => item.timestamp === value) || weather[0]
    );
  };

  return (
    <div>
      <div className="flex">
        <div>
          <div className="flex">
            <Image
              alt={selectedTimeWeatherData.weatherDescription}
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAAg5JREFUeNrt2tGRgyAQBmBLoARLSAmUkBIsISVYgiVYgiVQgq//myXQAfdwS4bJqRFuCWjWmZ3JaGYin8AumMY513xzNAIgAAIgAAIgAAIgAAIgAALwe4LhANACGADMANxLzHStbQoc2QGoce5g9JcBAKA2nvi7mAGoUwP8o/FPhOoBAGgAIwBD0ftxHNntiw6HJICdBiqa8BxD2E9MjNEAAO4bNzwxPn0fA/WsbNkjBWDZuNkHXZ8ZAQ5DfQQAwG3nJjR9xxWKpOwRC6D3AGgOcGdCYAMI0p8rHEMWAGq82Zit++B7roJoWQEAdBs/NPouR/PDUAnAwAaw0+27YKEzVdLw6EryCIDZabymIeBqC06AP93+QEa4LMASlLv2GwF81zc1N54bwJe29kA1WHMY/wBjAe4vY388KUBYLbY5FkNniudSOwXAXSTmlLWAKtRl/a4T91K7qxlgXKvpKQVzzUOmxiFgg70FBeBBu0I9fVacVWiNk6AOFmB2A6gLUrIO9wAoa5mcADnT4Phm9blWlClC0B6Pzve5AHIWQm1EmW1pSNiVcv129GGlboubXGmJGsWS56l37GFOqQA5FkMmputGDKeRLQ1+4mAEWKp4OxzR6KXEirA4QOZ9RPPuHWNRAMb3iMmbpKUBdOkNktIAt+oB5F9iAiAAAiAAAiAAAiAAAiAAAiAAAiAAl48fFVnRpiVnD+AAAAAASUVORK5CYII="
              width={64}
              height={64}
            />
            <div className="text-6xl flex ml-4">
              {Math.round(selectedTimeWeatherData.temperatureCelsius)}
              <span className="text-3xl self-start">°C</span>
            </div>
          </div>
          <div>
            <WeatherDetailsInfo
              label="Humidity"
              value={selectedTimeWeatherData.humidity + "%"}
            />
            <WeatherDetailsInfo
              label="Precipitation"
              value={
                selectedTimeWeatherData.precipitationProbability * 100 + "%"
              }
            />
            <WeatherDetailsInfo
              label="Wind"
              value={
                Math.round(selectedTimeWeatherData.windSpeedMetersPerSecond) +
                " m/s"
              }
            />
          </div>
        </div>
        <div className="text-end ml-auto max-w-xs">
          <div className="text-2xl font-bold">
            {location}, {countryCode}
          </div>
          <div className="text-slate-400 text-sm">
            <div>{utc(selectedTimeWeatherData.timestamp).calendar()}</div>
            <div>{selectedTimeWeatherData.weatherDescription}</div>
          </div>
        </div>
      </div>

      <WeatherGraph
        weatherData={weather}
        onSelectedTimeChange={onSelectedTimeChange}
      />
    </div>
  );
}

function WeatherDetailsInfo({ label, value }: any) {
  return (
    <div className="text-slate-400 text-sm">
      <span>{label}:</span> <span>{value}</span>
    </div>
  );
}
