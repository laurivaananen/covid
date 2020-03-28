import React from "react"
import { ICountry } from "./App"
import { ListRowContainer, ListRowContainerFirstItem, ListRowContainerSecondItem } from "./ListItem"
import { LineChart, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"

export interface ICountryItemProps {
  country: ICountry
  index: number
  toggleCountry: (country: ICountry) => void
}

export const buildInfectionRatePercentage = (rate: number) => {
  const countryInfectionRate = Math.round(rate)
  if (countryInfectionRate > 100) {
    return <span className={`text-red-400 font-bold`}>+{countryInfectionRate}%</span>
  } else if (countryInfectionRate > 0) {
    return <span className={`text-orange-400 font-bold`}>+{countryInfectionRate}%</span>
  } else if (countryInfectionRate === 0) {
    return <span className={`text-yellow-400 font-bold`}>{countryInfectionRate}%</span>
  } else {
    return <span className={`text-green-400 font-bold`}>-{countryInfectionRate}%</span>
  }
}

export const CountryItem: React.FunctionComponent<ICountryItemProps> = ({
  country,
  index,
  toggleCountry,
}) => {
  return (
    <ListRowContainer index={index}>
      <ListRowContainerFirstItem>
        <div className="font-bold cursor-pointer" onClick={() => toggleCountry(country)}>
          <i
            className={`fas ${
              country.isOpen ? "fa-chevron-circle-down" : "fa-chevron-circle-right"
            } text-gray-400 sm:mr-2 mr-1`}
          ></i>
          {country.region}
          {country.changePastWeek.confirmed > 100 && (
            <i className="fas fa-angle-double-up text-red-300 sm:ml-2 ml-1"></i>
          )}
          {country.changePastWeek.confirmed < 100 && country.changePastWeek.confirmed > 0 && (
            <i className="fas fa-angle-up text-orange-300 sm:ml-2 ml-1"></i>
          )}
          {country.changePastWeek.confirmed < 0 && (
            <i className="fas fa-angle-down text-green-300 sm:ml-2 ml-1"></i>
          )}
        </div>
      </ListRowContainerFirstItem>
      <ListRowContainerSecondItem>
        <div
          className="bg-red-400 h-full flex"
          style={{
            width: `${country.caseShare.deaths}%`,
          }}
        >
          <span className="m-auto text-red-600 font-bold overflow-x-hidden">
            {country.caseShare.deaths > 5 ? country.total.deaths : ""}
          </span>
        </div>
        <div
          className="bg-yellow-400 h-full flex"
          style={{
            width: `${country.caseShare.confirmed}%`,
          }}
        >
          <span className="m-auto text-yellow-600 font-bold overflow-x-hidden">
            {country.caseShare.confirmed > 5 ? country.total.confirmed : ""}
          </span>
        </div>
        <div
          className="bg-green-400 h-full flex"
          style={{
            width: `${country.caseShare.recovered}%`,
          }}
        >
          <span className="m-auto text-green-600 font-bold overflow-x-hidden">
            {country.caseShare.recovered > 5 ? country.total.recovered : ""}
          </span>
        </div>
      </ListRowContainerSecondItem>
      {country.isOpen ? (
        <div className={`w-full flex flex-col sm:flex-row pr-1 sm:pr-4 pt-4 pl-8`}>
          <dl className="sm:max-w-md sm:mr-12">
            <div>
              <h3 className="font-bold mb-2">Change Past Week</h3>
            </div>
            <div className="flex justify-between sm:grid sm:grid-cols-3">
              <dt className="text-gray-600 col-span-2 sm:pr-16">Confirmed:</dt>
              <dd>{buildInfectionRatePercentage(country.changePastWeek.confirmed)}</dd>
            </div>
            <div className="flex justify-between sm:grid sm:grid-cols-3">
              <dt className="text-gray-600 col-span-2 sm:pr-16">Deaths:</dt>
              <dd>{buildInfectionRatePercentage(country.changePastWeek.deaths)}</dd>
            </div>
            <div className="flex justify-between sm:grid sm:grid-cols-3">
              <dt className="text-gray-600 col-span-2 sm:pr-16">Recovered:</dt>
              <dd>
                <span className={`text-green-400 font-bold`}>
                  +{Math.round(country.changePastWeek.recovered)}%
                </span>
              </dd>
            </div>
          </dl>
          <ResponsiveContainer width="100%" height="100%" aspect={3} minWidth={150}>
            <LineChart
              data={country.timeSeries}
              margin={{
                top: 5,
                right: 30,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid stroke="#eeeeee" />
              <Line
                type="monotone"
                dataKey="confirmed"
                stroke="#f6e05e"
                strokeWidth={4}
                dot={false}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="deaths"
                stroke="#fc8181"
                strokeWidth={4}
                dot={false}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="recovered"
                stroke="#68d391"
                strokeWidth={4}
                dot={false}
                isAnimationActive={false}
              />
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
              <XAxis stroke="#aaaaaa" dataKey="date" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : null}
    </ListRowContainer>
  )
}
