import React, { useState, useEffect } from "react";
import axios from "axios";
import parse from "csv-parse/lib/sync";

export interface ICountry {
  region: string;
  isOpen: boolean;
  total: ICaseStatistics;
  changePastWeek: ICaseStatistics;
}

export interface ICaseStatistics {
  confirmed: number;
}

// const countryLatestData = (country: ICountry): IDailyStatistic => {
//   const latest = Object.values(country.timeseries)[
//     Object.keys(country.timeseries).length - 1
//   ];
//   console.log(latest.recovered);
//   if (!latest) {
//     return { confirmed: 0, deaths: 0, recovered: 0 };
//   }
//   return latest;
// };

// const countryPastWeek = (country: ICountry): IDailyStatistic => {
//   const latest = Object.values(country.timeseries)[
//     Object.keys(country.timeseries).length - 8
//   ];
//   if (!latest) {
//     return { confirmed: 0, deaths: 0, recovered: 0 };
//   }
//   return latest;
// };

const calculateConfirmedPastWeekChange = (countryRow: string[]) => {
  const latest = Number.parseInt(countryRow[countryRow.length - 1]);
  const pastWeek = Number.parseInt(countryRow[countryRow.length - 8]);
  const confirmedRatePercentagePastWeek =
    ((latest - pastWeek) / pastWeek) * 100;
  return confirmedRatePercentagePastWeek;
};

const App = () => {
  const [globalData, setGlobalData] = useState([] as ICountry[]);

  const FetchData = async () => {
    const confirmedTimeSeries = await axios(
      "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv"
    );
    const parsedData = parse(confirmedTimeSeries.data);
    const cleanedData: ICountry[] = parsedData
      .slice(1)
      .map((countryRow: string[], index: number) => {
        const countryData: ICountry = {
          region: buildRegionName(countryRow[1], countryRow[0]),
          isOpen: index === 0 ? true : false,
          total: {
            confirmed: Number.parseInt(countryRow[countryRow.length - 1])
          },
          changePastWeek: {
            confirmed: calculateConfirmedPastWeekChange(countryRow)
          }
        };
        return countryData;
      })
      .sort(
        (country1: ICountry, country2: ICountry) =>
          country2.total.confirmed - country1.total.confirmed
      );
    console.log(cleanedData);
    setGlobalData(cleanedData);
  };

  const toggleCountry = (country: ICountry) => {
    setGlobalData(
      globalData.map(countryData => {
        if (countryData.region === country.region) {
          return { ...countryData, isOpen: !countryData.isOpen };
        }
        return countryData;
      })
    );
  };

  useEffect(() => {
    FetchData();
  }, []);

  return (
    <div className="text-gray-800 sm:text-base text-sm antialiased">
      <ul>
        <li>
          <div className="flex items-center">
            <div className="font-bold mx-1 sm:mx-2 sm:mx-4 sm:w-2/12 w-5/12 text-xl text-center">
              Region
            </div>
            <div className="font-bold mx-1 sm:mx-2 sm:w-10/12 w-7/12 flex">
              <span className="text-yellow-600 bg-yellow-400 text-5xl flex-1 text-center">
                <i className="fas fa-biohazard"></i>
                <span className="text-sm block">Confirmed</span>
              </span>
            </div>
          </div>
        </li>
        {globalData.map((country: ICountry, index: number) => {
          return (
            <CountryItem
              key={`${country.region}`}
              country={country}
              index={index}
              toggleCountry={toggleCountry}
            />
          );
        })}
      </ul>
    </div>
  );
};

interface ICountryItemProps {
  country: ICountry;
  index: number;
  toggleCountry: (country: ICountry) => void;
}

const CountryItem: React.FunctionComponent<ICountryItemProps> = ({
  country,
  index,
  toggleCountry
}) => {
  return (
    <li
      onClick={() => toggleCountry(country)}
      className={`${!(index % 2) ? "bg-gray-100" : ""} cursor-pointer`}
    >
      <div className={`flex py-2 w-full`}>
        <div className="px-1 sm:px-4 md:w-2/12 w-5/12 font-bold">
          <i
            className={`fas ${
              country.isOpen
                ? "fa-chevron-circle-down"
                : "fa-chevron-circle-right"
            } text-gray-400 sm:mr-2 mr-1`}
          ></i>
          {country.region}
          {country.changePastWeek.confirmed > 100 && (
            <i className="fas fa-angle-double-up text-red-300 sm:ml-2 ml-1"></i>
          )}
          {country.changePastWeek.confirmed < 100 &&
            country.changePastWeek.confirmed > 0 && (
              <i className="fas fa-angle-up text-orange-300 sm:ml-2 ml-1"></i>
            )}
          {country.changePastWeek.confirmed < 0 && (
            <i className="fas fa-angle-down text-green-300 sm:ml-2 ml-1"></i>
          )}
        </div>
        <div className="px-1 sm:px-4 md:w-10/12 w-7/12">
          <div className="bg-gray-200 h-full flex">
            <div
              className="bg-yellow-400 h-full flex"
              style={{
                width: `100%`
              }}
            >
              <span className="m-auto text-yellow-600 font-bold overflow-x-hidden">
                {country.total.confirmed}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`${
          country.isOpen ? "visible" : "hidden"
        } w-full flex flex-col px-1 sm:px-4 py-2`}
      >
        <div>
          Infection Rate Past Week:{" "}
          {buildInfectionRatePercentage(country.changePastWeek.confirmed)}
        </div>
      </div>
    </li>
  );
};

const buildInfectionRatePercentage = (rate: number) => {
  const countryInfectionRate = rate.toFixed(2);
  if (rate > 100) {
    return (
      <span className={`text-red-400 font-bold`}>+{countryInfectionRate}%</span>
    );
  } else if (rate > 0) {
    return (
      <span className={`text-orange-400 font-bold`}>
        +{countryInfectionRate}%
      </span>
    );
  } else if (rate === 0) {
    return (
      <span className={`text-yellow-400 font-bold`}>
        {countryInfectionRate}%
      </span>
    );
  } else {
    return (
      <span className={`text-green-400 font-bold`}>
        -{countryInfectionRate}%
      </span>
    );
  }
};

const buildRegionName = (country: string, state: string): string => {
  if (state !== "" && state !== country) {
    return `${country}, ${state}`;
  }
  return country;
};

export default App;
