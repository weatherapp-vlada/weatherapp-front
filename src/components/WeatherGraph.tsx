import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useEffect, useState } from "react";
import moment from "moment";
import { useMediaQuery } from "usehooks-ts";

import { WeatherDto } from "@/api-client";

const COLOR_SCHEME_QUERY = "(prefers-color-scheme: dark)";

const CustomizedLabel = ({ x, y, stroke, value }: any) => (
  <text x={x} y={y} dy={-16} fill={stroke} fontSize={16} textAnchor="middle">
    {Math.round(value)}
  </text>
);

interface ChartDataPoint {
  timestamp: number;
  temp: number;
}

export default function WeatherGraph({
  weatherData,
  onSelectedTimeChange,
  startTimestamp,
}: {
  weatherData: WeatherDto[];
  onSelectedTimeChange: (val: number) => void;
  startTimestamp: number;
}) {
  const [color, setColor] = useState("black");
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [yAxisDomain, setYAxisDomain] = useState<number[]>();
  const [ticks, setTicks] = useState<number[]>(
    chartData.map((item) => item.timestamp)
  );
  const isDarkOS = useMediaQuery(COLOR_SCHEME_QUERY);

  useEffect(() => {
    setColor(window.getComputedStyle(document.body).getPropertyValue("color"));
  }, [isDarkOS]);

  useEffect(() => {
    const newChartData = weatherData.map(
      ({ timestamp, temperatureCelsius: temp }) => ({
        timestamp: new Date(timestamp).getTime(),
        temp,
      })
    );

    setChartData(newChartData);
    const temps = newChartData.map((item) => item.temp);
    setYAxisDomain([Math.min(...temps) - 1, Math.max(...temps) + 1]);
    setTicks(newChartData.slice(0, 8).map((item) => item.timestamp));
  }, [weatherData]);

  useEffect(() => {
    if (!chartData || !chartData.length) {
      return;
    }

    const first = Math.min(
      Math.max(
        chartData.findIndex(({ timestamp }) => startTimestamp < timestamp) - 1,
        0
      ),
      chartData.length - 8
    );

    console.log("first", first);

    setTicks(chartData.slice(first, first + 8).map((item) => item.timestamp));
  }, [chartData, startTimestamp]);

  useEffect(() => {
    console.log(ticks);
  }, [ticks]);

  const changeSelectedTime = (value: any) => {
    const selectedTime = value?.activeLabel ?? value?.value ?? value?.label;
    if (!selectedTime) {
      return;
    }

    onSelectedTimeChange(selectedTime);
  };

  return (
    <ResponsiveContainer width="100%" height="100%" minHeight={170}>
      <AreaChart
        width={500}
        height={80}
        data={chartData}
        margin={{
          top: 16,
          right: 20,
          left: 20,
          bottom: 5,
        }}
        onClick={changeSelectedTime}
        style={{ cursor: "pointer" }}
      >
        <YAxis domain={yAxisDomain} hide={true} />
        <XAxis
          dataKey="timestamp"
          type="number"
          tickLine={false}
          onClick={changeSelectedTime}
          tickFormatter={(val) => moment(val).format("HH:mm")}
          stroke={color}
          strokeOpacity={0}
          interval={0}
          allowDataOverflow={true}
          domain={[ticks[0], ticks.at(-1) ?? "dataMax"]}
          ticks={ticks}
        />
        {/* <Tooltip
          cursor={false}
          trigger="click"
          //   content={(val) => changeSelectedTime(val)}
        /> */}
        <Area
          type="monotone"
          dataKey="temp"
          stroke="rgba(255, 204, 0)"
          fillOpacity={1}
          fill="rgba(255, 204, 0, 0.2)"
          label={<CustomizedLabel stroke={color} />}
          isAnimationActive={false}
          activeDot={false}
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
