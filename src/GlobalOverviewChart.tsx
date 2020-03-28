import React, { useState } from "react"
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Legend,
  LegendValueFormatter,
  LegendPayload,
  Label,
} from "recharts"
import { ICountry } from "./App"

const LineColors = ["#38b2ac", "#9f7aea", "#ed8936"]

export const GlobalOverviewChart: React.FC<{ countries: ICountry[] }> = ({ countries }) => {
  const [lineHover, setLineHover] = useState<number | undefined>(undefined)
  return (
    <ResponsiveContainer width="100%" height="100%" aspect={3} minWidth={150}>
      <LineChart
        data={countries[1].timeSeries}
        margin={{
          top: 20,
          right: 20,
          left: 20,
          bottom: 20,
        }}
      >
        <CartesianGrid stroke="#eeeeee" />
        {countries
          .slice(1)
          .map((country: ICountry, index: number) =>
            CountryLine(
              country,
              LineColors[index],
              lineHover === index,
              lineHover !== index && lineHover !== undefined,
              () => setLineHover(index),
              () => setLineHover(undefined)
            )
          )}
        <Legend
          onMouseEnter={(...args: any[]) => setLineHover(args[1])}
          onMouseLeave={(...args: any[]) => setLineHover(undefined)}
          formatter={TopInfectionsLegendFormatter}
          iconType="square"
        />
        <XAxis stroke="#aaaaaa" dataKey="date" type="number" tickCount={30} />
        <YAxis
          tickFormatter={tick => {
            if (tick >= 1000) {
              return `${tick / 1000}k`
            }
            return tick
          }}
          type="number"
          stroke="#aaaaaa"
          allowDataOverflow={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export interface LinePoint {
  x: number
  y: number
  value: number
  index: number
}

const CountryLine = (
  country: ICountry,
  color: string,
  hover: boolean,
  hide: boolean,
  setLineHover: () => void,
  setLineUnHover: () => void
) => {
  return (
    <Line
      key={country.region}
      opacity={hide ? 0.3 : 1}
      name={country.region}
      data={country.timeSeries}
      type="linear"
      dataKey="confirmed"
      strokeWidth={hover ? 4 : 2}
      stroke={color}
      dot={false}
      isAnimationActive={false}
      label={point => (hover ? <LineLabel point={point} color={color} /> : null)}
      onMouseEnter={(...args: any[]) => setLineHover()}
      onMouseLeave={(...args: any[]) => setLineUnHover()}
    />
  )
}

const LineLabel: React.FC<{ point: LinePoint; color: string }> = ({ point, color }) => {
  return point.index % 5 === 4 ? (
    <text x={point.x} y={point.y} textAnchor="middle" className="text-gray-600 fill-current">
      <tspan x={point.x} dy="-0.335em">
        {point.value}
      </tspan>
    </text>
  ) : null
}

const TopInfectionsLegendFormatter: LegendValueFormatter = (
  value: any,
  entry?: LegendPayload,
  index?: number
) => {
  return <span className="text-gray-600 mr-4 text-sm hover:text-gray-800">{value}</span>
}
