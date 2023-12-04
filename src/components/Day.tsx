import React, {FC, DragEvent, useState, ChangeEvent, memo} from 'react';
import styled from "styled-components";
import Todo from "./Todo";
import {DayType, Label, TodoBlockType, TodoType} from "../types/type";
import {Holidays} from "../api/api";


const StyledDayContainer = styled.div<{ border: boolean, opacity: number }>`
  max-height: 150px;
  min-height: 100px;
  padding: 5px;
  vertical-align: baseline;
  background-color: rgba(238, 229, 226, 0.41);
  opacity: ${props => props.opacity};
  border: 1px solid ${props => props.border === true ? "aquamarine" : "transparent"};
`
const StyledInput = styled.input`
  position: absolute;
  z-index: 200;
  width: 95%;
  top: 30px;
`
const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100; /* Ensure it appears above other elements */
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledDateNumber = styled.p`
  padding: 0;
  margin: 5px;
  font-size: 18px;
`


interface DayProps {
    day: DayType,
    todo: TodoBlockType | undefined,
    holidays: (Holidays | never)[]
    handleTodoTransfer: (dateAdd: string, indexAdd: number | null, dateRemove: string, indexRemove: number, todo: TodoType) => void
    handleCreateEdit: (todoText: string, date: string, label: (never | Label)[], index: number | null) => void,
    labelArray: (never | Label)[]
}


const Day: FC<DayProps> = ({day, todo, holidays, labelArray, handleTodoTransfer, handleCreateEdit}) => {
    const {date, active} = day
    const [edit, setEdit] = useState<boolean>(false)
    const [newTodo, setNewTodo] = useState<string>('')
    const [dragOver, setDragOver] = useState<boolean>(false)
    const handleOnDrop = (e: DragEvent) => {
        const {todoDrop, indexRemove, dateRemove} = JSON.parse(e.dataTransfer.getData('application/json'));
        const updateTodo = {...todoDrop}
        setDragOver(false)
        handleTodoTransfer(date, todo?.todoList.length || null, dateRemove, indexRemove, updateTodo)
    }
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setNewTodo(e.target.value)
    }
    const handlerBackdropClick = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (newTodo) {
            handleCreateEdit(newTodo, date, [], null)
        }
        setNewTodo('')
        setEdit(false)
    }
    const handlerDragOver = (bool: boolean) => (e: DragEvent) => {
        e.preventDefault();
        setDragOver(bool)
    }

    const clickEditHandler = () => setEdit(true)

    return active ? (<StyledDayContainer
            opacity={1}
            onDrop={handleOnDrop}
            border={dragOver}
            onDragOver={handlerDragOver(true)}
            onDragLeave={handlerDragOver(false)}
            onClick={clickEditHandler}
        >
            <StyledDateNumber>{new Date(date).getDate()}</StyledDateNumber>
            <div style={{position: "relative"}}>
                {holidays.map(item => <p>{item.name}</p>)}
                <div>
                    {todo?.todoList.map((item, index) => (
                        <Todo
                            handleTodoTransfer={handleTodoTransfer}
                            handleCreateEdit={handleCreateEdit}
                            labelArray={labelArray}
                            todo={item}
                            date={date}
                            position={index}
                            key={`${item.text} ${item.label}`}/>))
                    }
                    {edit && <StyledInput
                        autoFocus
                        value={newTodo}
                        onChange={onChangeHandler}
                        placeholder='todo'/>}
                </div>

            </div>
            {edit && <Backdrop onClick={handlerBackdropClick}/>}
        </StyledDayContainer>) :
        (<StyledDayContainer border={false} opacity={0.5}>
                <p>{new Date(date).getDate()}</p>
            </StyledDayContainer>
        );
};

export default memo(Day)
