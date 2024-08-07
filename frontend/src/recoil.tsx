import axios from "axios";
import { atom, selector } from "recoil";


export const userAtom = atom({
    key: 'userAtom',
    default: selector({
        key: 'userAtomSelector',
        //@ts-ignore
        get: async ({ get }) => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/me`, {
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem('userLoginAllowed') ? sessionStorage.getItem('userLoginToken') : localStorage.getItem("token")}`,
                    }
                })
                return response.data   
            } catch (error) {
                console.log('error occured in recoil: ',error);
                return ""
            }
        }
    })
})