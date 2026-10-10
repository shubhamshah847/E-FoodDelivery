import axios from "axios";
import { serverURI } from "../App";
import { setShopData } from "../redux/userSlice";

export async function getShop(dispatch) {
    try {
        const result = await axios.get(
            serverURI + "/api/get-my-shop",
            {
                withCredentials: true
            }
        );

        dispatch(setShopData(result.data.shop));

    } catch (error) {
        console.error(
            "getShopDataerr:",
            error.response?.data || error.message
        );

        dispatch(setShopData(null));
    }
}