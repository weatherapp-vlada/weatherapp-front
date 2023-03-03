import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import { utc } from "moment";
import { useMediaQuery } from "usehooks-ts";

import { WeatherDto } from "@/api-client";

const COLOR_SCHEME_QUERY = "(prefers-color-scheme: dark)";

const CustomizedLabel = ({ x, y, stroke, value }: any) => (
  <text x={x} y={y} dy={-16} fill={stroke} fontSize={16} textAnchor="middle">
    {Math.round(value)}
  </text>
);

interface ChartDataPoint {
  time: string;
  temp: number;
}

export default function WeatherGraph({
  weatherData,
  onSelectedTimeChange,
}: {
  weatherData: WeatherDto[];
  onSelectedTimeChange: (val: string) => void;
}) {
  const [color, setColor] = useState("black");
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [yAxisDomain, setYAxisDomain] = useState<number[]>();

  const isDarkOS = useMediaQuery(COLOR_SCHEME_QUERY);

  useEffect(() => {
    setColor(window.getComputedStyle(document.body).getPropertyValue("color"));
  }, [isDarkOS]);

  useEffect(() => {
    if (typeof window !== undefined) {
    }
  }, []);

  useEffect(() => {
    const newChartData = weatherData.map(
      ({ timestamp, temperatureCelsius: temp }) => ({
        time: timestamp,
        temp,
      })
    );

    setChartData(newChartData);
    const temps = newChartData.map((item) => item.temp);
    setYAxisDomain([Math.min(...temps) - 1, Math.max(...temps) + 1]);
  }, [weatherData]);

  const changeSelectedTime = (value: any) => {
    if (!value || !value.activeLabel) {
      return;
    }

    onSelectedTimeChange(value.activeLabel);
  };

  return (
    <ResponsiveContainer width="100%" height="100%" minHeight={170}>
      <AreaChart
        width={500}
        height={80}
        data={chartData}
        margin={{
          top: 50,
          right: 20,
          left: 20,
          bottom: 5,
        }}
        onClick={changeSelectedTime}
      >
        <YAxis domain={yAxisDomain} hide={true} />
        <XAxis
          dataKey="time"
          tickLine={false}
          onClick={changeSelectedTime}
          tickFormatter={(val) => utc(val).format("HH:mm")}
          stroke={color}
          strokeOpacity={0}
          interval={0}
        />
        <Area
          type="linear"
          dataKey="temp"
          stroke="rgba(255, 204, 0)"
          fillOpacity={1}
          fill="rgba(255, 204, 0, 0.2)"
          dot={false}
          label={<CustomizedLabel stroke={color} />}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
