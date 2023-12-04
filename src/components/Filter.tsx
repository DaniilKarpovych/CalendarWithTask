import React, {ChangeEvent, FC, useEffect, useState} from 'react';
import styled from "styled-components";
import {Label} from "../types/type";

const StyledFilterContainer = styled.div`
  position: absolute;
  z-index: 300;
  top: calc(50% - 150px);
  left: calc(50% - 110px);
  max-width: 300px;
  max-height: 300px;
  min-width: 150px;
  min-height: 150px;
  background-color: rgba(179, 211, 211, 0.76);
  padding: 20px 15px;
  border-radius: 50px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`
const StyledLabel = styled.div<{ select: boolean }>`
  background-color: ${props => props.color};
  border-radius: 30px;
  padding: 0 5px;
  color: white;
  border: ${props => props.select ? "2px solid black" : "2px solid transparent"};
`
const StyledLabelContainer = styled.div`
  display: grid;
  margin-top: 10px;
  gap: 5px;
  overflow-y: auto;
`
const StyledSubmit = styled.button`
  margin-top: 10px;
  border: 0;
  cursor: pointer;
  border-radius: 30px;
  background-color: white;

  &:active {
    transform: scale(0.90); /* Scale the button down when it is active (clicked) */
  }
`

interface FilterProps {
    labelArray: (never | Label)[],
    handleFilter: (text: string, labels: string[]) => void
    filter: { text: string, labels: string[] }
}

const Filter: FC<FilterProps> = ({labelArray, handleFilter, filter}) => {
    const [filterText, setFilterText] = useState<string>('')
    const [filterLabel, setFilterLabel] = useState<string[]>([])
    useEffect(() => {
        if (filter.text !== filterText || filter.labels !== filterLabel) {
            setFilterText(filter.text)
            setFilterLabel(filter.labels)
        }
    }, [filter]);
    const handleOnChangeText = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setFilterText(e.target.value)
    }
    const handleOnClickLabel = (id: string) => (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setFilterLabel(state => {
            if (state.includes(id)) {
                return state.filter((item: string) => item !== id)
            }
            return [...state, id]
        })
    }
    const handleFilterSubmit = () => {
        handleFilter(filterText, filterLabel)
    }

    return (
        <StyledFilterContainer>
            <input onChange={handleOnChangeText} value={filterText} type="text" placeholder='Search by tasks text'/>
            <StyledLabelContainer>
                {labelArray.length > 0 && labelArray.map(item => {
                    const isSelected = filterLabel.includes(item.id)
                    return <StyledLabel
                        onClick={handleOnClickLabel(item.id)} select={isSelected}
                        color={item.color}>{item.label}</StyledLabel>
                })}
            </StyledLabelContainer>
            <StyledSubmit type='submit' onClick={handleFilterSubmit}>Submit</StyledSubmit>
        </StyledFilterContainer>
    );
};

export default Filter;
