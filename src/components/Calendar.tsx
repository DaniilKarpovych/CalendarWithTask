import React, {DragEvent, FC, useEffect, useState} from 'react';
import {Day} from "./Day";
import styled from "styled-components";
import {getAllCountry} from "../api/api";

const StyledCalendarContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
`
const StyledSettings = styled.div`
  display: flex;
  justify-content: space-between;
`
const months: Array<string> = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];


interface CalendarProps {
}

type Label = {
    id: string,
    todo: string
}

type DayType = {
    date: string,
    todo: (never | Label)[],
    label: (never | string)[],
    active: boolean
}

type Month = (DayType | null)[][];

const Calendar: FC<CalendarProps> = () => {
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
    const [allCountry, setAllCountry] = useState<any>([])
    const [month, setMonth] = useState<Month>()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getAllCountry();
                setAllCountry(response.data);
            } catch (error) {
                console.error('Error fetching countries:', error);
            }
        };

        fetchData();
    }, [])

    useEffect(() => {
        const daysInMonth = (date: Date): number => {
            const year = date.getFullYear();
            const month = date.getMonth() + 1; // Months are zero-based
            return new Date(year, month, 0).getDate();
        };

        const getFirstDayOfMonth = (date: Date): number => {
            const year = date.getFullYear();
            const month = date.getMonth();
            return new Date(year, month, 1).getDay(); // 0-indexed, 0 is Sunday
        };

        const generateCalendar = (): Month => {
            const month: Month = [];
            const totalDays = daysInMonth(currentMonth);
            const firstDay = getFirstDayOfMonth(currentMonth);
            const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDay();

            let week: (DayType | null)[] = [];

            // Add days before the first day of the month
            for (let i = firstDay - 1; i >= 0; i--) {
                const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0);

                date.setDate(date.getDate() - i);
                const day = {
                    date: `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`,
                    todo: [],
                    label: [],
                    active: false
                }
                week.push(day);
            }

            // Add days of the month
            for (let i = 1; i <= totalDays; i++) {
                const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i)
                const day = {
                    date: `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`,
                    todo: [],
                    label: [],
                    active: true
                }
                week.push(day);
                if (week.length % 7 === 0) {
                    month.push([...week]);
                    week = [];
                }
            }

            // Add days after the last day of the month
            for (let i = 1; i <= 6 - lastDay; i++) {
                const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, i)
                const day = {
                    id: `${Date.now()}${i}`,
                    date: `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`,
                    todo: [],
                    label: [],
                    active: true
                }
                week.push(day);
            }

            if (week.length > 0) {
                month.push([...week]);
            }

            return month;
        };
        setMonth(generateCalendar())
    }, [currentMonth]);


    const handlePrevMonth = (): void => {
        const newMonth = new Date(currentMonth);
        newMonth.setMonth(newMonth.getMonth() - 1);
        setCurrentMonth(newMonth);
    };

    const handleNextMonth = (): void => {
        const newMonth = new Date(currentMonth);
        newMonth.setMonth(newMonth.getMonth() + 1);
        setCurrentMonth(newMonth);
    };


    return (
        <StyledCalendarContainer
        >
            <StyledSettings>
                <div>
                    <button onClick={handleNextMonth}>UP</button>
                    <button onClick={handlePrevMonth}>DOWN</button>
                </div>
                <h3>{`${months[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`}</h3>
                <div>
                    <button>Month</button>
                    <button>Week</button>
                </div>

            </StyledSettings>
            <table>
                <thead>
                <tr>
                    <th>Sun</th>
                    <th>Mon</th>
                    <th>Tue</th>
                    <th>Wed</th>
                    <th>Thu</th>
                    <th>Fri</th>
                    <th>Sat</th>
                </tr>
                </thead>
                <tbody>

                {month?.map((week, index) => (
                    <tr>
                        {week?.map((day: any, index: number) => (
                            <Day
                                key={index}
                                day={day}
                            />))}
                    </tr>
                ))}

                </tbody>
            </table>
        </StyledCalendarContainer>
    );
};

export default Calendar;
