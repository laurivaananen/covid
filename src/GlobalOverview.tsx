import React from "react"
import { ICountry } from "./App"
import { buildInfectionRatePercentage } from "./CountryItem"
import { GlobalOverviewChart } from "./GlobalOverviewChart"
import { GlobalComparisonChart } from "./GlobalComparisonChart"

export const GlobalOverview: React.FC<{ countries: ICountry[] }> = ({ countries }) => {
  return (
    <div>
      {countries.length && (
        <div className="max-w-6xl mx-auto sm:px-4 px-1">
          <h1 className="text-5xl font-bold">Real-time Coronavirus tracker</h1>
          <dl className="grid grid-cols-3">
            <div className="mb-2 text-gray-600 col-start-2">Total</div>
            <div className="mb-2 text-gray-600">Change Past Week</div>
            <dt className="text-gray-600">Infections</dt>
            <dd>{countries[0].total.confirmed}</dd>
            <dd>{buildInfectionRatePercentage(countries[0].changePastWeek.confirmed)}</dd>
            <dt className="text-gray-600">Deaths</dt>
            <dd>{countries[0].total.deaths}</dd>
            <dd>{buildInfectionRatePercentage(countries[0].changePastWeek.deaths)}</dd>
            <dt className="text-gray-600">Recoveries</dt>
            <dd>{countries[0].total.recovered}</dd>
            <dd>
              <span className={`text-green-400 font-bold`}>
                +{Math.round(countries[0].changePastWeek.recovered)}%
              </span>
            </dd>
          </dl>
          <div>
            <GlobalOverviewChart countries={countries} />
            <GlobalComparisonChart countries={countries} />
          </div>
        </div>
      )}
    </div>
  )
}
