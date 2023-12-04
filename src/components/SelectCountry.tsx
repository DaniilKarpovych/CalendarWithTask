import React, {FC, useEffect, useState} from 'react';
import styled from "styled-components";
import {AllCountry, getAllCountry, getCountryPublicHolidays, Holidays} from "../api/api";
import {AxiosResponse} from "axios";


const SelectCountryContainer = styled.div`
  position: absolute;
  height: 300px;
  width: auto;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  top: calc(50% - 125px);
  left: calc(50% - 75px);
  padding: 20px 10px;
  background-color: rgba(179, 211, 211, 0.76);
  border-radius: 50px 50px 50px 50px;
  z-index: 200;
`
const StyledCountryBox = styled.div`
  overflow-y: auto;
  color: #736565;
`

const StyledCountry = styled.p`
  margin: 0;
  cursor: pointer;

  &:hover {
    background-color: orange;
  }

  &:active {
    transform: scale(0.90); /* Scale the button down when it is active (clicked) */
  }
`

interface SelectCountryProps {
    currentMonth: Date,
    handleAllCountryHoliday: (holidays: Holidays[]) => void
}

const SelectCountry: FC<SelectCountryProps> = ({currentMonth, handleAllCountryHoliday}) => {
    const [allCountry, setAllCountry] = useState<AllCountry[]>([])
    const [selectedCountry, setSelectedCountry] = useState<string>('')

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response: AxiosResponse = await getAllCountry();
                setAllCountry(response.data);
            } catch (error) {
                console.error('Error fetching countries:', error);
            }
        };

        fetchData();
    }, [])
    useEffect(() => {
        const fetchHolidays = async () => {
            try {
                const response: AxiosResponse = await getCountryPublicHolidays(currentMonth.getFullYear(), selectedCountry);
                handleAllCountryHoliday(response.data);
            } catch (error) {
                console.error('Error fetching countries:', error);
            }
        };

        fetchHolidays();
    }, [currentMonth, selectedCountry, handleAllCountryHoliday]);

    return (
        <SelectCountryContainer>
            <StyledCountryBox>
                {allCountry.length > 0 && allCountry.map((item: any) =>
                    <StyledCountry onClick={() => setSelectedCountry(item.countryCode)}>{item.name}</StyledCountry>)}
            </StyledCountryBox>
        </SelectCountryContainer>
    );
};

export default SelectCountry;
