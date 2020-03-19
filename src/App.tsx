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
        <ul className={`flex py-4 px-4`}>
          <li className="flex-1 font-bold">Region</li>
          <li className="flex-1 font-bold">Total Infected</li>
          <li className="flex-1 font-bold">Total Deaths</li>
          <li className="flex-1 font-bold">Total Recovered</li>
          <li className="flex-1 font-bold">Infections Past Week</li>
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
            const latest = Number.parseInt(row[row.length - 1]);
            newRow.push(latest);

            const totalDeaths =
              covidDataDeaths[index + 1][covidDataDeaths[index + 1].length - 1];
            newRow.push(totalDeaths);

            const totalRecovered =
              covidDataRecovered[index + 1][
                covidDataRecovered[index + 1].length - 1
              ];
            newRow.push(totalRecovered);

            const threeDaysAgo = Number.parseInt(row[row.length - 8]);
            console.log(newRow[0], latest, threeDaysAgo);
            const difference = latest - threeDaysAgo;
            const percentage = (difference / threeDaysAgo) * 100;
            newRow.push(percentage.toFixed(1));

            return newRow;
          })
          .map((row: Array<string | number>, index: number) => {
            return (
              <ul
                className={`flex py-2 px-4 ${
                  !(index % 2) ? "bg-gray-200" : ""
                }`}
              >
                {row.map((value: string | number, index: number, orig) => {
                  if (index === orig.length - 1) {
                    if (Math.sign(value as number) > 0) {
                      return (
                        <li className="flex-1 text-red-500 font-bold">
                          +{value}%
                        </li>
                      );
                    } else if (Math.sign(value as number) < 0) {
                      return (
                        <li className="flex-1 text-green-400 font-bold">
                          {value}%
                        </li>
                      );
                    } else {
                      return (
                        <li className="flex-1 text-yellow-500 font-bold">
                          +{value}%
                        </li>
                      );
                    }
                  }
                  return <li className="flex-1">{value}</li>;
                })}
              </ul>
            );
          })}
      </ul>
    </div>
  );
};

export default App;
