import { BrekkyContext } from "../contexts/BrekkyProvider"
import { useContext, useEffect } from "react"

export default function MyRecipes() {

    const { user, setUser } = useContext(BrekkyContext)
    
    useEffect(() => {
        if (user.token) { 
            localStorage.setItem('token', JSON.stringify(user.token))
            localStorage.setItem('firstname', JSON.stringify(user.firstname))
            localStorage.setItem('username', JSON.stringify(user.username))
        }
        if (user.token || localStorage.getItem('token')) {
            const storedToken = localStorage.getItem('token')
            const storedUserName = localStorage.getItem('username')
            const storedFirstName = localStorage.getItem('firstname')
            if (storedToken && storedFirstName && storedUserName && !user.token) {
                setUser({
                    loggedIn: true, 
                    token: storedToken.replaceAll('"', ""), 
                    firstname: storedFirstName.replaceAll('"', ""), 
                    username: storedUserName.replaceAll('"', "")
                })
            }
        } 
    },[user])


    return (
        <>
            <div className="ml-16 mt-12 p-4 bg-gray-600">
                <h2>{user.firstname}'s Recipes</h2>
            </div>
        </>
    )
}