import { useEffect } from "react";
import { useFullApplicationDetailsById } from "../../../tanstack/query/getFullApplicationDetails";
import { useCountryByApplicationId } from "../../../tanstack/query/getCountryByApplicationId"; 

export const ApplicationDetail = ({ app, onLoad }) => {
  const { data: fullData } = useFullApplicationDetailsById(app.id);
  const { data: countryInfo } = useCountryByApplicationId(app.id);

  useEffect(() => {
    if (fullData && countryInfo) {
      const merged = {
        ...fullData,
        application_country_info: countryInfo, 
      };
      onLoad(merged);
    }
  }, [fullData, countryInfo, onLoad]);

  return null; 
};