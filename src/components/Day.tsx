import React, {FC, DragEvent, useState, ChangeEvent} from 'react';
import styled from "styled-components";
import Todo from "./Todo";


const StyledDayContainer = styled.td`
  height: 150px;
  width: 150px;
  vertical-align: baseline;
  background-color: rgba(238, 229, 226, 0.41);
  //cursor: move;
`
const StyledInput = styled.input`
  position: absolute;
  z-index: 200;

`
const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.5); /* Adjust the alpha value for transparency */
  z-index: 100; /* Ensure it appears above other elements */
  display: flex;
  justify-content: center;
  align-items: center;
`;

type DayType = {
    id: string,
    date: string,
    todo: (never | string)[],
    label: (never | string)[],
    active: boolean
}

const Day: FC<{ day: DayType }> = ({day}) => {
    const {date} = day
    const [todo, setTodo] = useState<Array<any>>([])
    const [edit, setEdit] = useState<boolean>(false)
    const [newTodo, setNewTodo] = useState<string>('')
    const handleOnDrop = (e: DragEvent) => {
        e.preventDefault()
        const droppedItem = JSON.parse(e.dataTransfer.getData('application/json'));
        setTodo(state => [...state, droppedItem?.task])
    }

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setNewTodo(e.target.value)

    }

    const handlerBackdropClick = (e: any) => {
        e.preventDefault()
        e.stopPropagation()
        setTodo(state => [...state, newTodo])
        setNewTodo('')
        setEdit(false)
    }

    const clickEditHandler = () => setEdit(true)

    return (

        <StyledDayContainer
            onDrop={handleOnDrop}
            onDragOver={(e: DragEvent) => {
                e.preventDefault();
            }}
            onClick={clickEditHandler}
        >
            <p>{new Date(date).getDate()}</p>
            <div style={{position: "relative"}}>
                {todo.map((item, index) => (
                    <Todo editHandler={clickEditHandler} todo={item} key={`${index} ${day}`}/>))
                }
                {edit && <StyledInput
                    value={newTodo}
                    onChange={onChangeHandler}
                    placeholder='todo'/>}
            </div>
            {edit && <Backdrop onClick={handlerBackdropClick}/>}
        </StyledDayContainer>
    );
};

export {Day, Backdrop};
