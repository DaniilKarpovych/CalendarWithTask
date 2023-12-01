import axios from "axios";

export const getAllCountry = async () => {
    return await axios.get<any>('https://date.nager.at/api/v3/AvailableCountries')

}

export const getCountryPublicHolidays = async (year: number, countryCode: string) => {
    return await axios.get<any>(`https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`)
}
