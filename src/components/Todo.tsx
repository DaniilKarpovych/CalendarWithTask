import React, {DragEvent, FC, useState} from 'react';
import {Backdrop} from "./Day";
import styled from "styled-components";


interface TodoProps {
    editHandler: () => void,
    todo: string
}

const StyledInput = styled.input`
  position: absolute;
  z-index: 200;
`

const Todo: FC<TodoProps> = ({todo, editHandler}) => {
    const [todoEdit, setTodoEdit] = useState<boolean>(false)
    const handlerOnDragStart = (e: DragEvent) => e.dataTransfer.setData('application/json', JSON.stringify({
        date: '31/11/12',
        task: todo
    }))

    const backdropSwitcher = (e: any) => {
        e.preventDefault()
        e.stopPropagation()
        // editHandler()
        setTodoEdit(state => !state)
    }

    return (

        <div draggable onDragStart={handlerOnDragStart} onClick={backdropSwitcher}>
            <div style={{position: "relative"}}>
                {todoEdit ? <StyledInput placeholder={todo}/> : <span>{todo}</span>}
            </div>
            {todoEdit && <Backdrop onClick={backdropSwitcher}/>}
        </div>
    );
}

export default Todo;
