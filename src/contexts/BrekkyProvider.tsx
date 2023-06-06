import { useState, createContext } from 'react'

interface UserContext { user: User, setUser: React.Dispatch<React.SetStateAction<User>> }
interface AuthChild { children: JSX.Element | JSX.Element[] }
interface User { token: string, username: string, firstname: string, loggedIn: boolean }

export const BrekkyContext = createContext<UserContext>({} as UserContext)

export default function BrekkyProvider({ children }: AuthChild) {
    const [ user, setUser ] = useState<User>({ token: '', username: '', firstname: '', loggedIn: false })
    return <BrekkyContext.Provider value={{ user, setUser}}>{ children }</BrekkyContext.Provider>
}