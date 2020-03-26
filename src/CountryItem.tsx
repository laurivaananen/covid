import React from "react";
import {
  ICountry,
  ListRowContainer,
  ListRowContainerFirstItem,
  ListRowContainerSecondItem
} from "./App";

export interface ICountryItemProps {
  country: ICountry;
  index: number;
  toggleCountry: (country: ICountry) => void;
}

const buildInfectionRatePercentage = (rate: number) => {
  const countryInfectionRate = Math.round(rate);
  if (countryInfectionRate > 100) {
    return (
      <span className={`text-red-400 font-bold`}>+{countryInfectionRate}%</span>
    );
  } else if (countryInfectionRate > 0) {
    return (
      <span className={`text-orange-400 font-bold`}>
        +{countryInfectionRate}%
      </span>
    );
  } else if (countryInfectionRate === 0) {
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

export const CountryItem: React.FunctionComponent<ICountryItemProps> = ({
  country,
  index,
  toggleCountry
}) => {
  return (
    <ListRowContainer index={index}>
      <ListRowContainerFirstItem>
        <div
          className="font-bold cursor-pointer"
          onClick={() => toggleCountry(country)}
        >
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
      </ListRowContainerFirstItem>
      <ListRowContainerSecondItem>
        <div
          className="bg-red-400 h-full flex"
          style={{
            width: `${country.caseShare.deaths}%`
          }}
        >
          <span className="m-auto text-red-600 font-bold overflow-x-hidden">
            {country.caseShare.deaths > 5 ? country.total.deaths : ""}
          </span>
        </div>
        <div
          className="bg-yellow-400 h-full flex"
          style={{
            width: `${country.caseShare.confirmed}%`
          }}
        >
          <span className="m-auto text-yellow-600 font-bold overflow-x-hidden">
            {country.caseShare.confirmed > 5 ? country.total.confirmed : ""}
          </span>
        </div>
        <div
          className="bg-green-400 h-full flex"
          style={{
            width: `${country.caseShare.recovered}%`
          }}
        >
          <span className="m-auto text-green-600 font-bold overflow-x-hidden">
            {country.caseShare.recovered > 5 ? country.total.recovered : ""}
          </span>
        </div>
      </ListRowContainerSecondItem>
      <div
        className={`${
          country.isOpen ? "visible" : "hidden"
        } w-full flex flex-col px-1 sm:px-4 py-2`}
      >
        <div>
          Infection Rate Past Week:{" "}
          {buildInfectionRatePercentage(country.changePastWeek.confirmed)}
        </div>
        <div>
          Death Rate Past Week:{" "}
          {buildInfectionRatePercentage(country.changePastWeek.deaths)}
        </div>
        <div>
          Recovery Rate Past Week:{" "}
          <span className={`text-green-400 font-bold`}>
            +{Math.round(country.changePastWeek.recovered)}%
          </span>
        </div>
      </div>
    </ListRowContainer>
  );
};
