import { createContext, useContext, useState } from "react"
import { googleLogout } from '@react-oauth/google';
import { getCollection } from "../../firebase";
import { addDoc, getDocs, query, where } from "firebase/firestore";
import { decodeToken } from "react-jwt";

googleLogout();
const authContext = createContext(null);
export const useAuth = () => useContext(authContext);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(localStorage.getItem('firebase_todo_user') ?
        JSON.parse(localStorage.getItem('firebase_todo_user')) : null);

    const login = (data) => {
        if (data?.credential) {
            const decodedJwt = decodeToken(data?.credential);
            const user = {
                email: decodedJwt.email,
                name: decodedJwt.name,
                picture: decodedJwt.picture,
            }

            if (user.email && user.name) {
                const createIfNotExists = async () => {
                    const q = query(getCollection("users"), where("email", "==", user.email));
                    const { docs } = await getDocs(q);
                    let tempUser = null;
                    if (docs.length === 0) {
                        addDoc(getCollection("users"), user)
                            .then((res) => {
                                tempUser = { ...user, userId: res.id }
                            }).catch((error) => {
                                console.error(error);
                            })
                    } else {
                        tempUser = { ...user, userId: docs[0].id }
                    }
                    console.log('tempUser :>> ', tempUser);
                    setUser(tempUser)
                    localStorage.setItem('firebase_todo_user', JSON.stringify(tempUser));
                }
                
                createIfNotExists()
            }


        }
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem('firebase_todo_user');
        googleLogout();
    }

    return (
        <authContext.Provider value={{
            isLoggedIn: Boolean(user),
            user,
            login,
            logout
        }}>
            {children}
        </authContext.Provider>
    )
}

export default AuthProvider