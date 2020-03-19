import React, { useState, useEffect } from "react";
import axios from "axios";
import csvParser from "csv-parse/lib/sync";

const App = () => {
  const [covidDataInfected, setCovidDataInfected] = useState([] as Array<
    string[]
  >);
  const [covidDataDeaths, setCovidDataDeaths] = useState([] as Array<string[]>);
  const [covidDataRecovered, setCovidDataRecovered] = useState([] as Array<
    string[]
  >);

  const FetchData = async () => {
    const infectedResponse = await axios(
      "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv"
    );
    const infectedData = csvParser(infectedResponse.data);

    const deathsResponse = await axios(
      "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Deaths.csv"
    );
    const deathsData = csvParser(deathsResponse.data);

    const revoredResponse = await axios(
      "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Recovered.csv"
    );
    const recoveredData = csvParser(revoredResponse.data);

    // sortedData.sort((row: string, row2: string) => {
    //   return (
    //     Number.parseInt(row2[row2.length - 1]) -
    //     Number.parseInt(row[row.length - 1])
    //   );
    // });
    setCovidDataDeaths(deathsData);
    setCovidDataRecovered(recoveredData);
    setCovidDataInfected(infectedData);
  };

  useEffect(() => {
    FetchData();
  }, []);

  return (
    <div className="text-gray-800 sm:text-base text-sm leading-5 antialiased">
      <ul>
        <ul className={`flex py-4 w-full`}>
          <li className="font-bold w-3/12 mx-2 sm:mx-4">Region</li>
          {/* <li className="font-bold">Total Infected</li>
          <li className="font-bold">Total Deaths</li>
          <li className="font-bold">Total Recovered</li> */}
          <li className="font-bold w-6/12 mx-2 sm:mx-4">
            <span className="text-red-400">Deaths</span>
            <span className="font-normal text-gray-500 sm:px-4"> / </span>
            <span className="text-yellow-400">Infections</span>
            <span className="font-normal text-gray-500 sm:px-4"> / </span>
            <span className="text-green-400">Recoveries</span>
          </li>
          <li className="font-bold w-3/12 mx-2 sm:mx-4">
            Infections Past Week
          </li>
        </ul>
        {covidDataInfected
          .slice(1)
          .map((row: string[], index: number) => {
            const newRow: Array<string | number> = [];
            if (row[0] === row[1] || !row[0]) {
              newRow.push(row[1]);
            } else {
              const region = `${row[1]}, ${row[0]}`;
              newRow.push(region);
            }
            const totalInfections = Number.parseInt(row[row.length - 1]);
            newRow.push(totalInfections);

            const totalDeaths = Number.parseInt(
              covidDataDeaths[index + 1][covidDataDeaths[index + 1].length - 1]
            );
            // newRow.push(totalDeaths);

            const totalRecovered = Number.parseInt(
              covidDataRecovered[index + 1][
                covidDataRecovered[index + 1].length - 1
              ]
            );
            // newRow.push(totalRecovered);

            const totalCases = totalInfections + totalDeaths + totalRecovered;
            const infectionsPercent = (totalInfections / totalCases) * 100;
            newRow.push(infectionsPercent);
            const deathsPercent = (totalDeaths / totalCases) * 100;
            newRow.push(deathsPercent);
            const recoveredPercent = (totalRecovered / totalCases) * 100;
            newRow.push(recoveredPercent);

            const threeDaysAgo = Number.parseInt(row[row.length - 8]);
            const difference = totalInfections - threeDaysAgo;
            const percentage = (difference / threeDaysAgo) * 100;
            newRow.push(percentage.toFixed(1));

            return newRow;
          })
          .map((row: Array<string | number>, index: number) => {
            return (
              <ul
                className={`flex py-2 ${
                  !(index % 2) ? "bg-gray-200" : ""
                } w-full`}
              >
                {row.map((value: string | number, index: number, orig) => {
                  if (index === orig.length - 4) {
                    return (
                      <li className="w-6/12 mx-2 sm:mx-4">
                        <div className="bg-gray-100 h-full flex">
                          <div
                            className="bg-red-400 h-full"
                            style={{ width: `${row[index + 1]}%` }}
                          ></div>
                          <div
                            className="bg-yellow-400 h-full flex"
                            style={{ width: `${row[index]}%` }}
                          >
                            <span className="mx-auto text-yellow-600 font-bold">
                              {row[index - 1]}
                            </span>
                          </div>
                          <div
                            className="bg-green-400 h-full"
                            style={{ width: `${row[index + 2]}%` }}
                          ></div>
                        </div>
                      </li>
                    );
                  }
                  if (index === orig.length - 1) {
                    if (Math.sign(value as number) > 0) {
                      return (
                        <li className="text-red-500 font-bold w-3/12">
                          +{value}%
                        </li>
                      );
                    } else if (Math.sign(value as number) < 0) {
                      return (
                        <li className="text-green-400 font-bold w-3/12">
                          {value}%
                        </li>
                      );
                    } else {
                      return (
                        <li className="text-yellow-500 font-bold w-3/12"></li>
                      );
                    }
                  }
                  if (index === 0) {
                    return <li className="mx-2 sm:mx-4 w-3/12">{value}</li>;
                  }
                })}
              </ul>
            );
          })}
      </ul>
    </div>
  );
};

export default App;
