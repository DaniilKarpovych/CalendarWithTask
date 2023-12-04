import React, {ChangeEvent, DragEvent, FC, memo, useEffect, useState} from 'react';
import styled from "styled-components";
import {Label, TodoType} from "../types/type";

interface ContainerProps {
    visible?: boolean;
    border?: boolean
}


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
const StyledInput = styled.input`
  width: 95%;
`
const StyledAddLabelBox = styled.div`
  position: absolute;
  z-index: 300;
  right: 0;
  top: 25px;
  background-color: #f6f3f3;
  padding: 2px;
`
const StyledSelectLabel = styled.div`
  color: white;
  background-color: ${props => props.color};
  border: 2px solid transparent;
  z-index: 200;

  &:hover {
    border: 2px solid black;
  }
`
const StyledInputContainer = styled.div`
  position: relative
`
const StyledTodoContainer = styled.div<ContainerProps>`
  position: relative;
  transition: opacity 0.1s;
  opacity: ${(props) => props.visible ? 1 : 0};
  border: ${props => props.border === true ? "1px solid aquamarine" : undefined};

`
const TodoText = styled.p`
  background-color: white;
  border-bottom: 1px solid #e0dada;
  width: 100%;
  margin: 0;
  cursor: move;
`
const StyledLabelContainer = styled.div`
  background-color: white;

`

const StyledSelectButton = styled.button`
  border-radius: 30px;
  font-size: 14px;
  border: 0;
  z-index: 300;
  cursor: pointer;
  background-color: rgba(191, 239, 239, 0.49);

  &:active {
    transform: scale(0.90); /* Scale the button down when it is active (clicked) */
  }
`
const StyledLabelBox = styled.span`
  z-index: 500;
  color: white;
  font-size: 10px;
  margin-right: 2px;
  background-color: ${props => props.color};
`

interface TodoProps {
    todo: TodoType,
    labelArray: (never | Label)[],
    date: string,
    position: number,
    handleCreateEdit: (todoText: string, date: string, label: (never | Label)[], index: number | null) => void,
    handleTodoTransfer: (dateAdd: string, indexAdd: number | null, dateRemove: string, indexRemove: number, todo: TodoType) => void
}

const Todo: FC<TodoProps> = ({todo, labelArray, date, position, handleCreateEdit, handleTodoTransfer}) => {
    const {text, label} = todo
    const [visible, setVisible] = useState<boolean>(true)
    const [todoEdit, setTodoEdit] = useState<boolean>(false)
    const [todoText, setTodoText] = useState<string>(text)
    const [todoLabels, setTodoLabels] = useState<never | Label[]>(label)
    const [dragOverTodo, setDragOverTodo] = useState<boolean>(false)
    const [showLabels, setShowLabels] = useState<boolean>(false)
    useEffect(() => {
        if (text !== todoText)
            setTodoText(text)
    }, [text]);

    const handlerOnDragStart = (e: DragEvent) => {
        setVisible(false)
        if (text) {
            e.dataTransfer.setData('application/json', JSON.stringify({
                todoDrop: {text: text, label: todoLabels}, indexRemove: position, dateRemove: date
            }))
        }

    }
    const handleDragEnd = () => {
        setVisible(true)
    }

    const onChangeTodo = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        setTodoText(e.target.value)
    }
    const backdropSwitcher = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (text !== todoText || JSON.stringify(label) !== JSON.stringify(todoLabels)) {
            handleCreateEdit(todoText, date, todoLabels, position)
        }
        setShowLabels(false)
        setTodoEdit(state => !state)
    }
    const handleOnDrop = (e: DragEvent) => {
        e.stopPropagation()
        const {todoDrop, indexRemove, dateRemove} = JSON.parse(e.dataTransfer.getData('application/json'));
        const updateTodo = {...todoDrop}
        setDragOverTodo(false)
        handleTodoTransfer(date, position, dateRemove, indexRemove, updateTodo)
    }
    const handlerDragOver = (bool: boolean) => (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation()
        setDragOverTodo(bool)
    }
    const handleShowLabels = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setShowLabels(true)
    }
    const handleSelectTodo = (label: Label) => (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setTodoLabels(state => {
            if (state.find((item: Label) => item.id === label.id)) {
                return state.filter((item: Label) => item.id !== label.id)
            }
            return [...state, label]
        })
    }
    console.log('showLabels', showLabels)
    return (

        <StyledTodoContainer
            visible={visible}
            draggable
            border={dragOverTodo}
            onDrop={handleOnDrop}
            onDragEnd={handleDragEnd}
            onDragStart={handlerOnDragStart}
            onDragOver={handlerDragOver(true)}
            onDragLeave={handlerDragOver(false)}
            onClick={backdropSwitcher}>

            <StyledInputContainer>
                {todoEdit ?
                    <div>
                        <StyledInput autoFocus onChange={onChangeTodo} value={todoText}/>
                        <StyledAddLabelBox>
                            {showLabels ? labelArray.map((item: Label) => <StyledSelectLabel
                                    onClick={handleSelectTodo(item)} color={item.color}>{item.label}</StyledSelectLabel>) :
                                <StyledSelectButton onClick={handleShowLabels}>select labels</StyledSelectButton>}
                        </StyledAddLabelBox>
                    </div> :
                    <StyledLabelContainer>
                        <div>
                            {label?.map((item: Label) => <StyledLabelBox
                                color={item.color}>{item.label}</StyledLabelBox>)}
                        </div>
                        <TodoText>{todoText}</TodoText>
                    </StyledLabelContainer>}
            </StyledInputContainer>
            {todoEdit && <Backdrop onClick={backdropSwitcher}/>}
        </StyledTodoContainer>
    );
}

export default memo(Todo);
