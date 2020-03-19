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
  confirmed: number;
  deaths: number;
  recovered: number;
}

export interface IInfectionStateRatioPercentages {
  deaths: number;
  confirmed: number;
  recovered: number;
}

export interface ICountryStats extends ICountry {
  infectionStateRatioPercentages: IInfectionStateRatioPercentages;
}

const App = () => {
  const [globalData, setGlobalData] = useState([] as ICountry[]);

  const FetchData = async () => {
    const globalData = await axios(
      "https://wuhan-coronavirus-api.laeyoung.endpoint.ainize.ai/jhu-edu/latest"
    );
    globalData.data.sort(
      (country: ICountry, country2: ICountry) =>
        country2.confirmed - country.confirmed
    );
    setGlobalData(globalData.data);
  };

  useEffect(() => {
    FetchData();
  }, []);

  return (
    <div className="text-gray-800 sm:text-base text-sm leading-5 antialiased">
      <ul>
        <li>
          <ul className="flex">
            <li className="font-bold mx-2 sm:mx-4 sm:w-2/12 w-4/12 text-xl py-4">
              Region
            </li>
            <li className="font-bold mx-2 sm:mx-4 sm:w-10/12 w-8/12 flex">
              <span className="text-red-600 bg-red-400 text-5xl inline-block text-center flex-1 py-4">
                ✝
              </span>
              <span className="text-yellow-600 bg-yellow-400 text-5xl flex-1 inline-block text-center py-4">
                ☣️
              </span>
              <span className="text-green-600 bg-green-400 text-5xl flex-1 text-center py-4">
                👍
              </span>
            </li>
          </ul>
        </li>
        {globalData
          .map((country: ICountry) => {
            const totalCases =
              country.confirmed + country.deaths + country.recovered;

            const infectionStateRatioPercentages: IInfectionStateRatioPercentages = {
              deaths: (country.deaths / totalCases) * 100,
              confirmed: (country.confirmed / totalCases) * 100,
              recovered: (country.recovered / totalCases) * 100
            };

            return Object.assign({}, country, {
              infectionStateRatioPercentages
            });
          })
          .map((country: ICountryStats, index: number) => {
            return (
              <li>
                <ul
                  className={`flex py-2 ${
                    !(index % 2) ? "bg-gray-100" : ""
                  } w-full`}
                >
                  <li className="mx-2 sm:mx-4 sm:w-2/12 w-4/12">
                    {country.countryregion}
                  </li>
                  <li className="mx-2 sm:mx-4 sm:w-10/12 w-8/12">
                    <div className="bg-gray-200 h-full flex">
                      <div
                        className="bg-red-400 h-full flex"
                        style={{
                          width: `${country.infectionStateRatioPercentages.deaths}%`
                        }}
                      >
                        <span className="m-auto text-red-600 font-bold overflow-x-hidden">
                          {country.infectionStateRatioPercentages.deaths > 10 &&
                            country.deaths}
                        </span>
                      </div>
                      <div
                        className="bg-yellow-400 h-full flex"
                        style={{
                          width: `${country.infectionStateRatioPercentages.confirmed}%`
                        }}
                      >
                        <span className="m-auto text-yellow-600 font-bold overflow-x-hidden">
                          {country.infectionStateRatioPercentages.confirmed >
                            10 && country.confirmed}
                        </span>
                      </div>
                      <div
                        className="bg-green-400 h-full flex"
                        style={{
                          width: `${country.infectionStateRatioPercentages.recovered}%`
                        }}
                      >
                        <span className="m-auto text-green-600 font-bold overflow-x-hidden">
                          {country.infectionStateRatioPercentages.recovered >
                            10 && country.recovered}
                        </span>
                      </div>
                    </div>
                  </li>
                </ul>
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default App;
