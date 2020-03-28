import React, { useState, useEffect } from "react"
import axios from "axios"
import parse from "csv-parse/lib/sync"
import { CountryItem } from "./CountryItem"
import { ListRowContainer, ListRowContainerFirstItem, ListRowContainerSecondItem } from "./ListItem"
import { GlobalOverview } from "./GlobalOverview"

export interface ICountry {
  region: string
  isOpen: boolean
  total: ICaseStatistics
  changePastWeek: ICaseStatistics
  caseShare: ICaseStatistics
  lastWeek: ICaseStatistics
  timeSeries: IDataPoint[]
}

export interface IDataPoint {
  confirmed: number
  deaths: number
  recovered: number
  date: number
}

export interface ICaseStatistics {
  confirmed: number
  deaths: number
  recovered: number
}

const calculatePastWeekChange = (latest: number, pastWeek: number) => {
  if (pastWeek === 0) {
    return 0
  }
  const percentageChangePastWeek = ((latest - pastWeek) / pastWeek) * 100 || 0
  return percentageChangePastWeek
}

const App = () => {
  const [globalData, setGlobalData] = useState([] as ICountry[])

  const buildCountryTimeSeries = (
    countryRow: string[],
    deathCountryRow: string[],
    recoveredCountryRow: string[]
  ): IDataPoint[] => {
    return countryRow.slice(countryRow.length - 30).map((value: string, index: number) => ({
      confirmed: Number.parseInt(value),
      deaths: Number.parseInt(deathCountryRow[index + (countryRow.length - 30)]) || 0,
      recovered: Number.parseInt(recoveredCountryRow[index + (countryRow.length - 30)]) || 0,
      date: index,
    }))
  }

  const FetchData = async () => {
    const confirmedTimeSeries = await axios(
      // "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv"
      "http://localhost:3000/data.csv"
    )
    const deathsTimeSeries = await axios(
      "http://localhost:3000/deaths.csv"
      // "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv"
    )
    const recoveredTimeSeries = await axios(
      "http://localhost:3000/recovered.csv"
      // "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv"
    )
    const parsedConfirmedData: string[][] = parse(confirmedTimeSeries.data)
    const parsedDeathsData: string[][] = parse(deathsTimeSeries.data)
    const parsedRecoveredData: string[][] = parse(recoveredTimeSeries.data)

    const cleanedData: ICountry[] = parsedConfirmedData
      .slice(1)
      .map((confirmedCountryRow: string[], index: number) => {
        const countryRegion = buildRegionName(confirmedCountryRow[1], confirmedCountryRow[0])
        const deathCountryRow =
          parsedDeathsData.find(
            (deathCountryRow: string[]) =>
              countryRegion === buildRegionName(deathCountryRow[1], deathCountryRow[0])
          ) || []
        const recoveredCountryRow =
          parsedRecoveredData.find(
            (recoveredCountryRow: string[]) =>
              countryRegion === buildRegionName(recoveredCountryRow[1], recoveredCountryRow[0])
          ) || []
        const totalConfirmed = Number.parseInt(confirmedCountryRow[confirmedCountryRow.length - 1])
        const totalDeaths = deathCountryRow
          ? Number.parseInt(deathCountryRow[deathCountryRow.length - 1])
          : 0
        const totalRecovered = recoveredCountryRow
          ? Number.parseInt(recoveredCountryRow[recoveredCountryRow.length - 1])
          : 0
        const lastWeekConfirmed = Number.parseInt(
          confirmedCountryRow[confirmedCountryRow.length - 8]
        )
        const lastWeekDeaths = deathCountryRow
          ? Number.parseInt(deathCountryRow[deathCountryRow.length - 8])
          : 0
        const lastWeekRecovered = recoveredCountryRow
          ? Number.parseInt(recoveredCountryRow[recoveredCountryRow.length - 8])
          : 0
        const totalCases = totalConfirmed + totalDeaths + totalRecovered
        const countryData: ICountry = {
          region: countryRegion,
          isOpen: false,
          total: {
            confirmed: totalConfirmed,
            deaths: totalDeaths,
            recovered: totalRecovered,
          },
          changePastWeek: {
            confirmed: calculatePastWeekChange(totalConfirmed, lastWeekConfirmed),
            deaths: deathCountryRow ? calculatePastWeekChange(totalDeaths, lastWeekDeaths) : 0,
            recovered: recoveredCountryRow
              ? calculatePastWeekChange(totalRecovered, lastWeekRecovered)
              : 0,
          },
          caseShare: {
            confirmed: (totalConfirmed / totalCases) * 100 || 0,
            deaths: (totalDeaths / totalCases) * 100 || 0,
            recovered: (totalRecovered / totalCases) * 100 || 0,
          },
          lastWeek: {
            confirmed: lastWeekConfirmed,
            deaths: lastWeekDeaths,
            recovered: lastWeekRecovered,
          },
          timeSeries: buildCountryTimeSeries(
            confirmedCountryRow,
            deathCountryRow,
            recoveredCountryRow
          ),
        }
        return countryData
      })
    const totalData = cleanedData.reduce(
      (totalCountry: ICountry, country: ICountry, index: number, array: ICountry[]) => {
        totalCountry.caseShare.confirmed += country.caseShare.confirmed
        totalCountry.caseShare.deaths += country.caseShare.deaths
        totalCountry.caseShare.recovered += country.caseShare.recovered
        totalCountry.total.confirmed += country.total.confirmed
        totalCountry.total.deaths += country.total.deaths
        totalCountry.total.recovered += country.total.recovered
        totalCountry.lastWeek.confirmed += country.lastWeek.confirmed
        totalCountry.lastWeek.deaths += country.lastWeek.deaths
        totalCountry.lastWeek.recovered += country.lastWeek.recovered
        if (index === array.length - 1) {
          totalCountry.changePastWeek.confirmed = calculatePastWeekChange(
            totalCountry.total.confirmed,
            totalCountry.lastWeek.confirmed
          )
          totalCountry.changePastWeek.deaths = calculatePastWeekChange(
            totalCountry.total.deaths,
            totalCountry.lastWeek.deaths
          )
          totalCountry.changePastWeek.recovered = calculatePastWeekChange(
            totalCountry.total.recovered,
            totalCountry.lastWeek.recovered
          )
        }
        return totalCountry
      },
      {
        region: "Total",
        caseShare: {
          confirmed: 0,
          deaths: 0,
          recovered: 0,
        },
        total: {
          confirmed: 0,
          deaths: 0,
          recovered: 0,
        },
        changePastWeek: {
          confirmed: 0,
          deaths: 0,
          recovered: 0,
        },
        lastWeek: {
          confirmed: 0,
          deaths: 0,
          recovered: 0,
        },
        isOpen: false,
        timeSeries: [],
      }
    )
    setGlobalData(
      [totalData]
        .concat(cleanedData)
        .sort(
          (country1: ICountry, country2: ICountry) =>
            country2.total.confirmed - country1.total.confirmed
        )
        .map((country: ICountry, index: number) =>
          Object.assign({}, country, {
            isOpen: [0, 1, 2].includes(index) ? true : false,
          })
        )
    )
  }

  const toggleCountry = (country: ICountry) => {
    setGlobalData(
      globalData.map(countryData => {
        if (countryData.region === country.region) {
          return {
            ...countryData,
            isOpen: !countryData.isOpen,
          }
        }
        return countryData
      })
    )
  }

  useEffect(() => {
    FetchData()
  }, [])

  return (
    <main>
      <GlobalOverview countries={globalData} />
      <div className="text-gray-800 sm:text-base text-sm antialiased">
        <ul>
          <ListRowContainer index={1}>
            <ListRowContainerFirstItem>
              <h2 className="text-2xl m-auto font-bold">Region</h2>
            </ListRowContainerFirstItem>
            <ListRowContainerSecondItem>
              <span className="text-red-600 bg-red-400 text-5xl flex-grow text-center overflow-hidden">
                <i className="fas fa-cross"></i>
                <span className="text-sm block">Deaths</span>
              </span>
              <span className="text-yellow-600 bg-yellow-400 text-5xl flex-grow text-center overflow-hidden">
                <i className="fas fa-biohazard"></i>
                <span className="text-sm block">Confirmed</span>
              </span>
              <span className="text-green-600 bg-green-400 text-5xl flex-grow text-center overflow-hidden">
                <i className="fas fa-heart"></i>
                <span className="text-sm block">Recovered</span>
              </span>
            </ListRowContainerSecondItem>
            {/* {globalData.slice(5, 10).map((country: ICountry) => {
            console.log(country.timeSeries)
            return (
              <div>
                <Victory.VictoryLine data={country.timeSeries} x="date" y="confirmed" />
              </div>
            )
          })} */}
          </ListRowContainer>
          {globalData.slice(1).map((country: ICountry, index: number) => {
            return (
              <CountryItem
                key={`${country.region}`}
                country={country}
                index={index}
                toggleCountry={toggleCountry}
              />
            )
          })}
        </ul>
      </div>
    </main>
  )
}

const buildRegionName = (country: string, state: string): string => {
  if (state !== "" && state !== country) {
    return `${country}, ${state}`
  }
  return country
}

export default App
