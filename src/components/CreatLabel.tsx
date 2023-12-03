import React, {ChangeEvent, useState} from 'react';
import {CirclePicker, ColorResult} from 'react-color';
import styled from "styled-components";
import {Label} from "../types/type";


const LabelCreateContainer = styled.div`
  position: absolute;
  height: 300px;
  width: auto;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  top: calc(50% - 125px);
  left: calc(50% - 150px);
  padding: 20px 10px;
  background-color: rgba(179, 211, 211, 0.76);
  border-radius: 50px 50px 50px 50px;
  z-index: 200;
`
const StyledInput = styled.input`
  margin-top: 10px;
  border: 0;
  height: 20px;
  font-size: 14px;
`
const LabelBox = styled.div`
  color: white;
  background-color: ${props => props.color};
`
const LabelContainer = styled.div`
  overflow-y: auto;
`

interface ColorPickerProps {
    labelCreateEdit: (color: string, label: string, id: string | null, remove: boolean) => void;
    labelArray: (never | Label)[]
}

const CreatLabel: React.FC<ColorPickerProps> = ({labelCreateEdit, labelArray}) => {
    const [selectedColor, setSelectedColor] = useState<string>('#f44336');
    const [labelText, setLabelText] = useState<string>('');
    const [selectEditId, setSelectEditId] = useState<string>('')

    const handleChangeComplete = (color: ColorResult) => {
        setSelectedColor(color.hex);
    };
    const handleOnChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
        setLabelText(e.target.value)
    }
    const handleLabelCreate = () => {
        if (labelText) {
            labelCreateEdit(selectedColor, labelText, null, false)
            setLabelText('')
            setSelectedColor('#f44336')
        }
    }
    const handleLabelEdit = (remove: boolean) => () => {
        if (labelText) {
            labelCreateEdit(selectedColor, labelText, selectEditId, remove)
            setLabelText('')
            setSelectedColor('#f44336')
            setSelectEditId('')
        }
    }
    const handleEdit = (item: Label) => () => {
        setSelectedColor(item.color)
        setLabelText(item.label)
        setSelectEditId(item.id)
    }

    return (
        <LabelCreateContainer>
            <CirclePicker
                color={selectedColor}
                onChangeComplete={handleChangeComplete}
            />
            <StyledInput value={labelText} onChange={handleOnChangeInput} type="text" placeholder='label text'/>
            {selectEditId ? <div>
                <button onClick={handleLabelEdit(false)}>Edit</button>
                <button onClick={handleLabelEdit(true)}>Remove</button>
                <button onClick={handleEdit({color: '#f44336', label: '', id: ''})}>Cancel</button>
            </div> : <button onClick={handleLabelCreate}>Create Label</button>}
            <LabelContainer>
                {labelArray?.map((item: Label) => <LabelBox onClick={handleEdit(item)} color={item.color}>
                    <p>{item.label}</p>
                </LabelBox>)}
            </LabelContainer>
        </LabelCreateContainer>
    );
};

export default CreatLabel;
