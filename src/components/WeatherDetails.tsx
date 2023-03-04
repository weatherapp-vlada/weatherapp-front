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
  const [now] = useState(utc());
  const [startTimestamp, setStartTimestamp] = useState(
    new Date(weather[0].timestamp).getTime()
  );

  const onSelectedTimeChange = (value: number) => {
    setSelectedTimeWeatherData(
      weather.find((item) => new Date(item.timestamp).getTime() === value) ||
        weather[0]
    );
  };

  const onDayChange = (event: any) => {
    setStartTimestamp(event.target.value);
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
        startTimestamp={startTimestamp}
      />

      <div className="flex">
        <DayRadioButton day={now.startOf("d")} onDayChange={onDayChange} />
        <DayRadioButton
          day={now.clone().add(1, "d").startOf("d")}
          onDayChange={onDayChange}
        />
      </div>
    </div>
  );
}

function DayRadioButton({ day, onDayChange }: any) {
  return (
    <div className="flex items-center pl-4 border border-gray-200 rounded dark:border-gray-700">
      <input
        id={`day-radio-${day.unix()}`}
        type="radio"
        value={day}
        onChange={onDayChange}
        name="bordered-radio"
        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
      />
      <label
        htmlFor={`day-radio-${day.unix()}`}
        className="w-full py-4 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
      >
        {day.format("ddd")}
      </label>
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
