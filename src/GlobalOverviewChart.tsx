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
} from "recharts"
import { ICountry } from "./App"

const LineColors = ["#38b2ac", "#9f7aea", "#ed8936"]

export const GlobalOverviewChart: React.FC<{ countries: ICountry[] }> = ({ countries }) => {
  const [lineHover, setLineHover] = useState<number | undefined>(undefined)
  const [selectedCase, setSelectedCase] = useState<Case>(Case.CONFIRMED)

  const selectCase = (selectedCase: Case): void => {
    setSelectedCase(selectedCase)
  }
  const chartAspect = (windowWidth: number) => {
    if (windowWidth > 1024) {
      return 2.5
    } else if (windowWidth > 640) {
      return 2
    }
    return 1.25
  }
  return (
    <div>
      <CaseSelector selectedCase={selectedCase} selectCase={selectCase} />
      <ResponsiveContainer width="100%" height="100%" aspect={chartAspect(window.innerWidth)}>
        <LineChart
          margin={{
            right: 20,
          }}
          data={countries[1].timeSeries}
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
                () => setLineHover(undefined),
                selectedCase
              )
            )}
          <Legend
            onMouseEnter={(...args: any[]) => setLineHover(args[1])}
            onMouseLeave={(...args: any[]) => setLineHover(undefined)}
            formatter={TopInfectionsLegendFormatter}
            iconType="square"
          />
          <XAxis tickMargin={4} stroke="#aaaaaa" dataKey="date" type="number" tickCount={30} />
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
    </div>
  )
}

enum Case {
  CONFIRMED = "Confirmed",
  DEATHS = "Deaths",
  RECOVERED = "Recovered",
}

const CaseSelector: React.FC<{ selectedCase: Case; selectCase: (selectedCase: Case) => void }> = ({
  selectedCase,
  selectCase,
}) => {
  return (
    <ul className={"flex mb-2"}>
      <li>
        <button
          onClick={() => selectCase(Case.CONFIRMED)}
          className={`bg-yellow-100 border border-yellow-400 hover:bg-yellow-200 text-yellow-600 px-4 py-2 rounded-md mr-2`}
        >
          {Case.CONFIRMED}
        </button>
      </li>
      <li>
        <button
          onClick={() => selectCase(Case.DEATHS)}
          className={`bg-red-100 border border-red-400 hover:bg-red-200 text-red-600 px-4 py-2 rounded-md mr-2`}
        >
          {Case.DEATHS}
        </button>
      </li>
      <li>
        <button
          onClick={() => selectCase(Case.RECOVERED)}
          className={`bg-green-100 border border-green-400 hover:bg-green-200 text-green-600 px-4 py-2 rounded-md`}
        >
          {Case.RECOVERED}
        </button>
      </li>
    </ul>
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
  setLineUnHover: () => void,
  selectedCase: Case
) => {
  return (
    <Line
      key={country.region}
      opacity={hide ? 0.3 : 1}
      name={country.region}
      data={country.timeSeries}
      type="linear"
      dataKey={selectedCase.toLowerCase()}
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
