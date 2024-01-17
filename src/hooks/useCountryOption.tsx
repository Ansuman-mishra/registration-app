import { useState, useEffect } from "react";
import axios from "axios";
import { Country } from "../types/types";
const useCountryOptions = (initialSearchTerm: string = "") => {
    const [countryOptions, setCountryOptions] = useState<Country[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>(initialSearchTerm);

    const fetchCountries = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`https://restcountries.com/v3.1/name/${searchTerm}`);
            const countries = response.data.map((country: any) => ({
                name: country.name.common,
            }));
            setCountryOptions(countries);
        } catch (error) {
            console.error("Error fetching countries:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Fetch countries when the component mounts or when the searchTerm changes
        fetchCountries();
    }, [searchTerm]);

    const handleInputChange = (newSearchTerm: string) => {
        setSearchTerm(newSearchTerm);
    };

    return {
        countryOptions,
        loading,
        handleInputChange,
    };
};

export default useCountryOptions;
