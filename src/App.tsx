import React, { useState, useEffect } from "react";
import axios from "axios";

export interface ILocation {
  lat: number;
  lng: number;
}

export interface ICountrycode {
  iso2: string;
  iso3: string;
}

export interface ICountry {
  provincestate: string;
  countryregion: string;
  lastupdate: Date;
  location: ILocation;
  countrycode: ICountrycode;
  timeseries: ITimeseries;
  isOpen: boolean;
}

export interface IDailyStatistic {
  confirmed?: number;
  deaths?: number;
  recovered: number;
}

export interface ITimeseries {
  [key: string]: IDailyStatistic;
}

export interface IInfectionStateRatioPercentages {
  deaths: number;
  confirmed: number;
  recovered: number;
}

export interface ILatestData {
  deaths: number;
  confirmed: number;
  recovered: number;
}

export interface ICountryStats extends ICountry {
  infectionStateRatioPercentages: IInfectionStateRatioPercentages;
  latestData: ILatestData;
  infectionRatePercentagePastWeek: number;
}

const countryLatestData = (country: ICountry): IDailyStatistic => {
  const latest = Object.values(country.timeseries)[
    Object.keys(country.timeseries).length - 1
  ];
  if (!latest) {
    return { confirmed: 0, deaths: 0, recovered: 0 };
  }
  return latest;
};

const countryPastWeek = (country: ICountry): IDailyStatistic => {
  const latest = Object.values(country.timeseries)[
    Object.keys(country.timeseries).length - 8
  ];
  if (!latest) {
    return { confirmed: 0, deaths: 0, recovered: 0 };
  }
  return latest;
};

const App = () => {
  const [globalData, setGlobalData] = useState([] as ICountry[]);

  const FetchData = async () => {
    const globalData = await axios(
      "https://wuhan-coronavirus-api.laeyoung.endpoint.ainize.ai/jhu-edu/timeseries"
    );
    globalData.data.sort(
      (country: ICountry, country2: ICountry) =>
        (countryLatestData(country2).confirmed || 0) -
        (countryLatestData(country).confirmed || 0)
    );
    setGlobalData(
      globalData.data.map((country: ICountry) =>
        Object.assign({}, country, { isOpen: false })
      )
    );
  };

  const toggleCountry = (country: ICountry) => {
    setGlobalData(
      globalData.map(countryData => {
        if (
          buildRegionName(
            countryData.countryregion,
            countryData.provincestate
          ) === buildRegionName(country.countryregion, country.provincestate)
        ) {
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
          <ul className="flex">
            <li className="font-bold mx-1 sm:mx-2 sm:mx-4 sm:w-2/12 w-5/12 text-xl py-4">
              Region
            </li>
            <li className="font-bold mx-1 sm:mx-2 sm:w-10/12 w-7/12 flex">
              <span className="text-red-600 bg-red-400 text-5xl inline-block text-center flex-1 py-4">
                <i className="fas fa-cross"></i>
              </span>
              <span className="text-yellow-600 bg-yellow-400 text-5xl flex-1 inline-block text-center py-4">
                <i className="fas fa-biohazard"></i>
              </span>
              <span className="text-green-600 bg-green-400 text-5xl flex-1 text-center py-4">
                <i className="fas fa-heart"></i>
              </span>
            </li>
          </ul>
        </li>
        {globalData
          .map((country: ICountry) => {
            const latestDeaths = countryLatestData(country).deaths || 0;
            const latestRecovered = countryLatestData(country).recovered || 0;
            const latestConfirmed = countryLatestData(country).confirmed || 0;
            const totalCases = latestConfirmed + latestDeaths + latestRecovered;

            const pastWeekConfirmed = countryPastWeek(country).confirmed || 0;
            const infectionRatePercentagePastWeek =
              ((latestConfirmed - pastWeekConfirmed) / pastWeekConfirmed) * 100;

            const infectionStateRatioPercentages: IInfectionStateRatioPercentages = {
              deaths: (latestDeaths / totalCases) * 100,
              confirmed: (latestConfirmed / totalCases) * 100,
              recovered: (latestRecovered / totalCases) * 100
            };

            return Object.assign(
              {},
              country,
              {
                infectionStateRatioPercentages
              },
              {
                latestData: {
                  deaths: latestDeaths,
                  confirmed: latestConfirmed,
                  recovered: latestRecovered
                }
              },
              { infectionRatePercentagePastWeek }
            );
          })
          .map((country: ICountryStats, index: number) => {
            return (
              <CountryItem
                key={`${country.countryregion}${country.provincestate}`}
                country={country}
                index={index}
                toggleCountry={toggleCountry}
              />
            );
            // return countryItem(country, index);
          })}
      </ul>
    </div>
  );
};

interface ICountryItemProps {
  country: ICountryStats;
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
        <div className="px-1 sm:px-4 sm:w-2/12 w-5/12 font-bold">
          <i
            className={`fas ${
              country.isOpen
                ? "fa-chevron-circle-down"
                : "fa-chevron-circle-right"
            } text-gray-400 sm:mr-2 mr-1`}
          ></i>
          {buildRegionName(country.countryregion, country.provincestate)}
          {country.infectionRatePercentagePastWeek > 100 && (
            <i className="fas fa-angle-double-up text-red-300 sm:ml-2 ml-1"></i>
          )}
          {country.infectionRatePercentagePastWeek < 100 &&
            country.infectionRatePercentagePastWeek > 0 && (
              <i className="fas fa-angle-up text-orange-300 sm:ml-2 ml-1"></i>
            )}
          {country.infectionRatePercentagePastWeek < 0 && (
            <i className="fas fa-angle-down text-green-300 sm:ml-2 ml-1"></i>
          )}
        </div>
        <div className="px-1 sm:px-4 sm:w-10/12 w-7/12">
          <div className="bg-gray-200 h-full flex">
            <div
              className="bg-red-400 h-full flex"
              style={{
                width: `${country.infectionStateRatioPercentages.deaths}%`
              }}
            >
              <span className="m-auto text-red-600 font-bold overflow-x-hidden">
                {country.infectionStateRatioPercentages.deaths > 10 &&
                  country.latestData.deaths}
              </span>
            </div>
            <div
              className="bg-yellow-400 h-full flex"
              style={{
                width: `${country.infectionStateRatioPercentages.confirmed}%`
              }}
            >
              <span className="m-auto text-yellow-600 font-bold overflow-x-hidden">
                {country.infectionStateRatioPercentages.confirmed > 10 &&
                  country.latestData.confirmed}
              </span>
            </div>
            <div
              className="bg-green-400 h-full flex"
              style={{
                width: `${country.infectionStateRatioPercentages.recovered}%`
              }}
            >
              <span className="m-auto text-green-600 font-bold overflow-x-hidden">
                {country.infectionStateRatioPercentages.recovered > 10 &&
                  country.latestData.recovered}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`${
          country.isOpen ? "visible" : "hidden"
        } w-full flex px-1 sm:px-4 py-2`}
      >
        <span>
          Infection Rate Past Week: {buildInfectionRatePercentage(country)}
        </span>
      </div>
    </li>
  );
};

const buildInfectionRatePercentage = (country: ICountryStats) => {
  const countryInfectionRate = country.infectionRatePercentagePastWeek.toFixed(
    2
  );
  if (country.infectionRatePercentagePastWeek > 100) {
    return (
      <span className={`text-red-400 font-bold`}>+{countryInfectionRate}%</span>
    );
  } else if (country.infectionRatePercentagePastWeek > 0) {
    return (
      <span className={`text-orange-400 font-bold`}>
        +{countryInfectionRate}%
      </span>
    );
  } else if (country.infectionRatePercentagePastWeek === 0) {
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
