import axios from "axios";
import { serverURI } from "../App";
import { setuserData } from "../redux/userSlice";

export async function getUserData(dispatch) {
    try {
        const user = await axios.get(
            serverURI + "/auth/get-current-user",
            {
                withCredentials: true
            }
        );

       

        dispatch(setuserData(user.data));

    } catch (error) {
        console.error(
            "getUserData:",
            error.response?.data || error.message
        );

        dispatch(setuserData(null));
    }
}