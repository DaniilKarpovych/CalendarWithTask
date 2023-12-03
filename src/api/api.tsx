import axios, {AxiosResponse} from "axios";


export type Holidays = {
    date: string,
    localName: string,
    name: string,
    countryCode: string,
    fixed: boolean,
    global: true,
    counties: [
        string
    ],
    launchYear: number,
    types: [
        string
    ]
}
export type AllCountry = {
    name: string,
    countryCode: string
}
export const getAllCountry = async () => {
    return await axios.get<AxiosResponse<AllCountry[]>>('https://date.nager.at/api/v3/AvailableCountries')

}

export const getCountryPublicHolidays = async (year: number, countryCode: string) => {
    return await axios.get<AxiosResponse<Holidays[]>>(`https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`)
}
