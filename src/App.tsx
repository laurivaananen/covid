import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [covidData, setCovidData] = useState("");

  const FetchData = async () => {
    const result = await axios(
      "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv"
    );
    setCovidData(result.data);
  };

  useEffect(() => {
    FetchData();
  }, []);

  return (
    <div className="text-gray-800 sm:text-base text-sm leading-5 antialiased">
      <ul>
        {covidData.split("\n").map((row: string, index: number) => {
          return (
            <ul className={`flex py-2 ${index % 2 ? "bg-gray-200" : ""}`}>
              {row
                .split(",")
                .filter(
                  (_columnName: string, index: number, columns: string[]) => {
                    return index < 2 || index > columns.length - 4;
                  }
                )
                .map((value: string) => {
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
