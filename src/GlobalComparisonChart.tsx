import React, { useState } from "react"
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Legend,
  LegendValueFormatter,
  LegendPayload,
} from "recharts"
import { ICountry } from "./App"

const BarIsHidden = (hover: undefined | number, index: number): boolean => {
  return hover === index ? false : hover === undefined ? false : true
}

export const GlobalComparisonChart: React.FC<{ countries: ICountry[] }> = ({ countries }) => {
  const [barHover, setBarHover] = useState<number | undefined>(undefined)
  const chartAspect = (windowWidth: number) => {
    if (windowWidth > 1024) {
      return 2.75
    } else if (windowWidth > 640) {
      return 2
    }
    return 1.25
  }
  return (
    <ResponsiveContainer width="100%" height="100%" aspect={chartAspect(window.innerWidth)}>
      <BarChart
        margin={{
          right: 20,
        }}
        barGap={0}
        data={countries.map((country: ICountry) => ({
          name: country.region,
          confirmed: country.total.confirmed,
          deaths: country.total.deaths,
          recovered: country.total.recovered,
        }))}
      >
        <CartesianGrid stroke="#eeeeee" />
        <Bar
          fill="#f6e05e"
          onMouseEnter={() => setBarHover(0)}
          onMouseLeave={() => setBarHover(undefined)}
          opacity={BarIsHidden(barHover, 0) ? 0.5 : 1.0}
          className="fill-current text-yellow-400"
          dataKey="confirmed"
          label={(props: any) =>
            BarLabel(
              Object.assign({}, props, {
                color: BarIsHidden(barHover, 0) ? "text-yellow-400" : "text-yellow-600",
              })
            )
          }
          isAnimationActive={false}
        />
        <Bar
          fill="#fc8181"
          onMouseEnter={() => setBarHover(1)}
          onMouseLeave={() => setBarHover(undefined)}
          opacity={BarIsHidden(barHover, 1) ? 0.5 : 1.0}
          className="fill-current text-red-400"
          label={(props: any) =>
            BarLabel(
              Object.assign({}, props, {
                color: BarIsHidden(barHover, 1) ? "text-red-400" : "text-red-600",
              })
            )
          }
          isAnimationActive={false}
          dataKey="deaths"
        />
        <Bar
          fill="#68d391"
          onMouseEnter={() => setBarHover(2)}
          onMouseLeave={() => setBarHover(undefined)}
          opacity={BarIsHidden(barHover, 2) ? 0.5 : 1.0}
          className="fill-current text-green-400"
          label={(props: any) =>
            BarLabel(
              Object.assign({}, props, {
                color: BarIsHidden(barHover, 2) ? "text-green-400" : "text-green-600",
              })
            )
          }
          isAnimationActive={false}
          dataKey="recovered"
        />
        <Legend
          onMouseEnter={(...args: any[]) => setBarHover(args[1])}
          onMouseLeave={(...args: any[]) => setBarHover(undefined)}
          formatter={CountryComparisonLegendFormatter}
          iconType="square"
        />
        <XAxis tickMargin={4} stroke="#aaaaaa" dataKey="name" />
        <YAxis
          tickFormatter={tick => {
            if (tick >= 1000) {
              return `${tick / 1000}k`
            }
            return tick
          }}
          type="number"
          stroke="#aaaaaa"
        />
      </BarChart>
    </ResponsiveContainer>
  )
}

const BarLabel = (props: any) => {
  return (
    <text
      x={props.x + props.width / 2}
      y={props.y + props.height / 2}
      width={props.width}
      height={props.height}
      className={`${props.color} fill-current zIndex-50 recharts-text recharts-label`}
      textAnchor="middle"
    >
      <tspan x={props.x + props.width / 2} dy="0.335em">
        {props.value}
      </tspan>
    </text>
  )
}

const CountryComparisonLegendFormatter: LegendValueFormatter = (
  value: any,
  entry?: LegendPayload,
  index?: number
) => {
  return <span className="text-gray-600 mr-4 text-sm hover:text-gray-800">{value}</span>
}
