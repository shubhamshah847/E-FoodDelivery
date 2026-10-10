import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCity } from "../redux/userSlice";
import { setAddress, setLocation } from "../redux/mapSlice";


function useUserLocation() {
  const { userData } = useSelector(state => state.user)
  const dispatch = useDispatch();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        dispatch(setLocation({ lat: latitude, long: longitude }))
        try {
          const location_city = await axios.get(
            `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${import.meta.env.VITE_LOCATION_API}`
          );
          const city = location_city?.data?.results?.[0].city;
          const address = location_city.data.results[0]?.address_line2;
          dispatch(setAddress(location_city.data.results[0]?.address_line2))
          dispatch(setCity(city));
          dispatch(setAddress(address))

        } catch (err) {
          console.error("Reverse geocoding failed:", err);
        }
      },
      (error) => {
        console.error("Location permission error:", error);
      }
    );
  }, [userData]);
  return null;
}

export default useUserLocation;