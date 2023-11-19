import { createContext, useState, useEffect, useReducer } from 'react'

interface userType {
    email: string,
    password: string
}

interface ContextValue {
    message: string | undefined,
    login: boolean,
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    dispatch: ({type}: any) => void
    currentuser: any,
    user: userType,
    state: any
}

export const userAuthContext = createContext<ContextValue | null>(null);

export const UserAuthProvider = (props: any) => {
    const storedUser = localStorage.getItem("current_user");
    const initialUser = storedUser ? JSON.parse(storedUser) : null
    const [currentuser, setCurrentUser] = useState(initialUser || null)

    const [message, setMessage] = useState<string | undefined>();

    const [login, setLogin] = useState<boolean>(false);

    const [user, setUser] = useState<userType>({
        email: "",
        password: "",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setUser(user => ({
            ...user,
            [name]: value
        }))
    }

    const reducer = async (state: any, action: any) => {
        switch (action.type) {
            case "LOGIN": {
                const { email, password } = user
                try {
                    const response = await fetch('/user/login', {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            email, password
                        })
                    })
                    if (response) {
                        const data = await response.json();
                        if (data.success == true) {
                            setMessage(data.message)
                            document.cookie = `user_access=${data.token}; path=/`
                            setCurrentUser(data.userdata)
                            setLogin(data.success)
                            return { ...state, data }
                        }
                        else {
                            setLogin(data.success)
                            setMessage(data.message)
                            return { ...state, data }
                        }
                    }
                } catch (error) {
                    console.log(error);
                }
                break;
            }
            case "LOGOUT": {
                const cookie = document.cookie
                document.cookie = cookie + ";max-age=0"
                console.log("en");
                setCurrentUser('')
                setLogin(false)
                return { ...state, success: false }
            }

            default: return state
        }
    }

    useEffect(() => {
        localStorage.setItem("current_user", JSON.stringify(currentuser));
    }, [currentuser])

    useEffect(() => {
        document.cookie ? setLogin(true) : setLogin(false)
    }, [])

    const [state, dispatch] = useReducer<any>(reducer, '')

    const info: ContextValue = { state, dispatch, handleChange, login, message, currentuser, user}
    return (
        <userAuthContext.Provider value={info}>
            {props.children}
        </userAuthContext.Provider>
    )
}
