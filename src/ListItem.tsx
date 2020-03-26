import React from "react"

export interface IListRowContainerProps {
  index: number
  children: any | any[]
}

export const ListRowContainer: React.FunctionComponent<IListRowContainerProps> = ({
  index,
  children,
}) => (
  <li className={`${!(index % 2 === 1) ? "bg-gray-100" : ""} py-2`}>
    <div className=" w-full lg:max-w-6xl mx-auto flex flex-wrap ">{children}</div>
  </li>
)

export interface IListRowContainerFirstItemProps {
  children: any | any[]
}

export const ListRowContainerFirstItem: React.FunctionComponent<
  IListRowContainerFirstItemProps
> = ({ children }) => <div className="px-1 sm:px-4 lg:w-3/12 w-5/12 flex">{children}</div>

export const ListRowContainerSecondItem: React.FunctionComponent<
  IListRowContainerFirstItemProps
> = ({ children }) => <div className="px-1 sm:px-4 lg:w-9/12 w-7/12 flex">{children}</div>
