import React, {ChangeEvent, FC, useCallback, useEffect, useMemo, useState} from 'react';
import Day from "./Day";
import styled from "styled-components";
import {DayType, Label, Month, TodoBlockType, TodoType} from "../types/type";
import CreatLabel from "./CreatLabel";
import Filter from "./Filter";
import SelectCountry from "./SelectCountry";
import {Holidays} from "../api/api";

const StyledCalendarContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 0 5px;
`
const StyledSettings = styled.div`
  display: flex;
  justify-content: space-between;
`
const StyledCalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
`
const StyledSettingBtn = styled.button`
  margin: 5px;
  padding: 10px;
  border-radius: 30px;
  font-size: 14px;
  border: 0;
  cursor: pointer;
  background-color: rgba(191, 239, 239, 0.49);

  &:active {
    transform: scale(0.90); /* Scale the button down when it is active (clicked) */
  }
`

const StyledInput = styled.input`
  /* Hide default input text */
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;

  &:focus + label {
    /* Style label when input is focused (optional) */
    border: 1px solid #357ebd;
  }
`;

const StyledLabel = styled.label`
  margin: 5px;
  padding: 10px;
  max-width: 180px;
  border-radius: 30px;
  border: 0;
  cursor: pointer;
  background-color: rgba(191, 239, 239, 0.49);
  display: inline-block;

  &:active {
    transform: scale(0.90);
  }
`;
const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const months: Array<string> = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

interface CalendarProps {
    downloadAsImage: () => void
}

const Calendar: FC<CalendarProps> = ({downloadAsImage}) => {
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
    const [showSelectCountry, setShowSelectCountry] = useState<boolean>(false)
    const [month, setMonth] = useState<Month>([])
    const [todoArray, setTodoArray] = useState<(TodoBlockType | never)[]>([])
    const [showCreateLabel, setShowCreateLabel] = useState<boolean>(false)
    const [labelArray, setLabelArray] = useState<(never | Label)[]>([])
    const [showFilter, setShowFilter] = useState<boolean>(false)
    const [filter, setFilter] = useState<{ text: string, labels: string[] }>({text: '', labels: []})
    const [countryHolidays, setCountryHolidays] = useState<(Holidays | never)[]>([])

    const dateCorrection = useCallback((date: number) => {
        if (date < 10) {
            return '0' + date
        } else {
            return date
        }
    }, [])


    const daysInMonth = useMemo(() => (date: Date): number => {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        return new Date(year, month, 0).getDate();
    }, []);

    const getFirstDayOfMonth = useMemo(() => (date: Date): number => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month, 1).getDay();
    }, []);

    const generateCalendar = useCallback(() => {
        const newMonth: Month = [];
        const totalDays = daysInMonth(currentMonth);
        const firstDay = getFirstDayOfMonth(currentMonth);
        const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDay();

        for (let i = firstDay - 1; i >= 0; i--) {
            const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0);
            date.setDate(date.getDate() - i);
            const isActive = Math.trunc(new Date().setHours(0, 0, 0) / 1000) <= Math.trunc(+date / 1000)


            const day = {
                date: `${date.getFullYear()}-${dateCorrection(date.getMonth() + 1)}-${dateCorrection(date.getDate())}`,
                todo: [],
                active: isActive,
            };
            newMonth.push(day);
        }

        for (let i = 1; i <= totalDays; i++) {
            const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);

            const isActive = Math.trunc(new Date().setHours(0, 0, 0) / 1000) <= Math.trunc(+date / 1000)

            const day = {
                date: `${date.getFullYear()}-${dateCorrection(date.getMonth() + 1)}-${dateCorrection(date.getDate())}`,
                todo: [],
                active: isActive,
            };

            newMonth.push(day);
        }

        for (let i = 1; i <= 6 - lastDay; i++) {
            const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, i);
            const isActive = Math.trunc(new Date().setHours(0, 0, 0) / 1000) <= Math.trunc(+date / 1000)


            const day = {
                date: `${date.getFullYear()}-${dateCorrection(date.getMonth() + 1)}-${dateCorrection(date.getDate())}`,
                todo: [],
                active: isActive,
            };

            newMonth.push(day);
        }

        return newMonth;
    }, [currentMonth, daysInMonth, getFirstDayOfMonth]);

    useEffect(() => {
        setMonth(generateCalendar());
    }, [generateCalendar]);


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
    const handleTodoTransfer = (dateAdd: string, indexAdd: number | null, dateRemove: string, indexRemove: number, todo: TodoType): void => {

        setTodoArray((state: TodoBlockType[]): TodoBlockType[] => {
            let indexForDelete
            const newState: (TodoBlockType | never)[] = []
            if (indexAdd === null) {
                newState.push({date: dateAdd, todoList: [todo]})
            }
            const updatedState = state?.map((item: TodoBlockType | never, index: number): TodoBlockType | never => {
                if (item?.date === dateAdd && item?.date === dateRemove && indexAdd !== null) {
                    const newTodoList = [...item.todoList]
                    newTodoList.splice(indexRemove, 1)
                    newTodoList.splice(indexAdd, 0, todo)
                    return {...item, todoList: newTodoList}
                } else if (item?.date === dateAdd && indexAdd !== null) {
                    const newTodoList = [...item.todoList]
                    newTodoList.splice(indexAdd, 0, todo)
                    return {...item, todoList: newTodoList}
                } else if (item?.date === dateRemove) {
                    const newTodoList = [...item.todoList]
                    newTodoList.splice(indexRemove, 1)

                    if (newTodoList.length === 0) {
                        indexForDelete = index
                    }
                    return {...item, todoList: newTodoList}
                } else {
                    return item
                }
            })
            if (indexForDelete !== undefined) {
                updatedState?.splice(indexForDelete, 1)
            }

            return newState.concat(updatedState)
        })
    }
    const handleCreateEditTodo = (todoText: string, date: string, label: (never | Label)[], index: number | null) => {
        setTodoArray((state: (TodoBlockType | never)[]): (TodoBlockType | never)[] => {

            const updateTodo = state.find((todo: TodoBlockType) => todo.date === date)
            if (updateTodo) {

                return state.map((item: TodoBlockType) => {
                    if (item.date === date) {
                        const newTodoList = [...item.todoList]
                        if (index !== null) {
                            newTodoList.splice(index, 1, {text: todoText, label: label})
                        } else {
                            newTodoList.push({text: todoText, label: label})
                        }
                        return {...item, todoList: newTodoList}
                    }
                    return item
                })
            } else {
                return [...state, {date: date, todoList: [{text: todoText, label: [...label]}]}]
            }
        })
    }
    const handleCreateEditLabel = (color: string, label: string, id: string | null, remove: boolean) => {

        const labelId = `${color}${label}`
        const repeated = labelArray.findIndex((item: Label) => item.id === labelId)
        if (id === null && repeated === -1) {

            setLabelArray(state => [...state, {id: labelId, color: color, label: label}])
        } else if (id && !remove) {
            setLabelArray(state => state.map((item: Label) => {
                if (item.id === id) {
                    return {id: id, color: color, label: label}
                }
                return item
            }))
        } else if (id && remove) {
            setLabelArray(state => state.filter((item: Label) => item.id !== id))
        }
    }
    const handleBackdrop = () => {
        setShowCreateLabel(false)
        setShowFilter(false)
        setShowSelectCountry(false)
    }

    const handleFilter = (text: string, labels: string[]) => {
        setFilter({text, labels})
    }
    const handleAllCountryHolidays = (holidays: Holidays[]) => {
        setCountryHolidays(holidays)
        setShowSelectCountry(false)
    }
    const downloadTasksAsJson = () => {
        const jsonContent = JSON.stringify(todoArray, null, 2);
        const blob = new Blob([jsonContent], {type: 'application/json'});
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'tasks.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        uploadTasksFromJson(file);
    };

    const uploadTasksFromJson = (file: File | null) => {
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const jsonContent = event.target?.result as string;
                const parsedTasks: TodoBlockType[] = JSON.parse(jsonContent);

                const updatedCalendar: TodoBlockType[] = [...todoArray, ...parsedTasks];


                setTodoArray(updatedCalendar);
            };
            reader.readAsText(file);
        }
    };

    console.log('month', month)
    return (
        <StyledCalendarContainer>
            <StyledSettings>
                <div>
                    <StyledSettingBtn onClick={handlePrevMonth}>Prev</StyledSettingBtn>
                    <StyledSettingBtn onClick={handleNextMonth}>Next</StyledSettingBtn>
                </div>
                <h1>{`${months[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`}</h1>
                <div>
                    <StyledSettingBtn onClick={() => setShowFilter(true)}>Set Filter</StyledSettingBtn>
                    <StyledSettingBtn onClick={() => setShowCreateLabel(true)}>Create Label</StyledSettingBtn>
                    <StyledSettingBtn onClick={() => setShowSelectCountry(true)}>Select Country
                        Holiday</StyledSettingBtn>
                    <StyledSettingBtn onClick={downloadTasksAsJson}>Download Tasks</StyledSettingBtn>
                    <StyledInput type="file" id="fileInput" onChange={handleFileChange}/>
                    <StyledLabel htmlFor="fileInput">Upload Tasks</StyledLabel>
                    <StyledSettingBtn onClick={downloadAsImage}>Download As Image</StyledSettingBtn>
                </div>
            </StyledSettings>
            <StyledCalendarGrid>
                <div>Sun</div>
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>
                {month?.map((day: DayType, index: number) => {
                    let todoProps = todoArray?.find(item => item.date === day?.date)
                    const holidays = countryHolidays.filter((item: Holidays) => item.date === day?.date)
                    if ((filter.text || filter.labels.length > 0) && todoProps) {

                        const result = todoProps?.todoList.filter((item: TodoType) => {
                            return item.text.includes(filter.text) && (item.label.length > 0 &&
                                item.label.filter(item => filter.labels.includes(item.id)).length >= filter.labels.length)
                        })

                        todoProps = {...todoProps, todoList: result}
                    }
                    return <Day
                        handleCreateEdit={handleCreateEditTodo}
                        handleTodoTransfer={handleTodoTransfer}
                        labelArray={labelArray}
                        todo={todoProps}
                        holidays={holidays}
                        key={index}
                        day={day}
                    />
                })}


            </StyledCalendarGrid>
            {showCreateLabel && <CreatLabel labelArray={labelArray} labelCreateEdit={handleCreateEditLabel}/>}
            {(showCreateLabel || showFilter || showSelectCountry) && <Backdrop onClick={handleBackdrop}/>}
            {showFilter && <Filter filter={filter} handleFilter={handleFilter} labelArray={labelArray}/>}
            {showSelectCountry &&
                <SelectCountry handleAllCountryHoliday={handleAllCountryHolidays} currentMonth={currentMonth}/>}
        </StyledCalendarContainer>
    );
};

export default Calendar;
