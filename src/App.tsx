import React, { useState, useEffect } from "react";
import axios from "axios";
import { orchid } from "color-name";

const App = () => {
  const [covidData, setCovidData] = useState([] as Array<string[]>);

  const FetchData = async () => {
    const result = await axios(
      "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv"
    );
    const sortedData = result.data
      .split("\n")
      .slice(1)
      .map((row: string) => row.split(/,"|",|,(?=\S)/));

    sortedData.sort((row: string, row2: string) => {
      return (
        Number.parseInt(row2[row2.length - 1]) -
        Number.parseInt(row[row.length - 1])
      );
    });
    setCovidData(sortedData);
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
          <li className="flex-1 font-bold">Change Past Week</li>
        </ul>
        {covidData
          .map((row: string[]) => {
            const newRow: Array<string | number> = [];
            if (row[0] === row[1] || !row[0]) {
              newRow.push(row[1]);
            } else {
              const region = `${row[1]}, ${row[0]}`;
              newRow.push(region);
            }
            const latest = Number.parseInt(row[row.length - 1]);
            newRow.push(latest);
            const threeDaysAgo = Number.parseInt(row[row.length - 8]);
            console.log(newRow[0], latest, threeDaysAgo);
            const difference = latest - threeDaysAgo;
            const percentage = (difference / threeDaysAgo) * 100;
            newRow.push(percentage.toFixed(1));

            return newRow;
          })
          // .map((row: string[]) => {
          //   const latest = row[row.length - 1];
          //   row[row.length] = latest;
          //   return row;
          // })
          .map((row: Array<string | number>, index: number) => {
            return (
              <ul
                className={`flex py-2 px-4 ${
                  !(index % 2) ? "bg-gray-200" : ""
                }`}
              >
                {row
                  // .filter(
                  //   (_columnName: string, index: number, columns: string[]) => {
                  //     return index === 1 || index > columns.length - 4;
                  //   }
                  // )
                  .map((value: string | number, index: number, orig) => {
                    if (index === orig.length - 1) {
                      if (Math.sign(value as number) > 0) {
                        return (
                          <li className="flex-1 text-red-400 font-bold">
                            +{value}%
                          </li>
                        );
                      } else if (Math.sign(value as number) < 0) {
                        return (
                          <li className="flex-1 text-green-400 font-bold">
                            {value}%
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
