import React, { useState, useEffect, useLayoutEffect } from "react";
import axios from "axios";
import * as d3 from "d3-dsv";

const App = () => {
  const [covidData, setCovidData] = useState([] as any);
  const [status, setStatus] = useState("");

  const FetchData = async () => {
    setStatus("Loading..");
    const result = await axios(
      "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv"
    );
    const parsed = d3.csvParse(result.data);
    console.log(parsed);
    parsed.sort((row: any, row2: any) => {
      console.log(row["3/15/20"]);
      return Number.parseInt(row2["3/15/20"]) - Number.parseInt(row["3/15/20"]);
    });
    setCovidData(parsed);
    setStatus("");
  };

  useEffect(() => {
    FetchData();
  }, []);

  return (
    <div>
      <ul>
        <ul className="text-green-300">
          <li>Country</li>
          <li>Total</li>
        </ul>
        {status && (
          <ul>
            <li>{status}</li>
          </ul>
        )}
        {covidData.map((x: any) => {
          return (
            <ul>
              <li>{x["Country/Region"]}</li>
              <li>{x["3/15/20"]}</li>
            </ul>
          );
        })}
      </ul>
    </div>
  );
};

export default App;
