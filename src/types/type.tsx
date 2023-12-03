export type Label = {
    id: string,
    label: string,
    color: string
}
export type TodoType = {
    text: string,
    label: (never | Label)[]
}

export type TodoBlockType = {
    date: string | never,
    todoList: (never | TodoType)[],
}


export type DayType = {
    date: string,
    active: boolean
}
export type Month = (DayType | never)[];
