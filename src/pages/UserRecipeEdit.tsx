import { BrekkyContext } from "../contexts/BrekkyProvider"
import { useContext, useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { UserRec } from "./MyRecipes"

const base_api_url = import.meta.env.VITE_APP_BASE_API

export default function UserRecipeEdit() {

    const { user, setUser } = useContext(BrekkyContext)
    const [ userRecipe, setUserRecipe ] = useState<UserRec>()
    const { useRecIdParam } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        (async () => {
            const res = await fetch(`${base_api_url}/get/${useRecIdParam}`)
            if (!res.ok) {
                throw new Error("Failed to fetch")
            }
            const data = await res.json()
            const meals: UserRec = await data.recipe_user_content
            console.log(meals)
            setUserRecipe(meals)
        })()
    }, [])

    useEffect(() => {
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
        } else if (user.token) { 
            localStorage.setItem('token', JSON.stringify(user.token))
            localStorage.setItem('firstname', JSON.stringify(user.firstname))
            localStorage.setItem('username', JSON.stringify(user.username))
        } else {
            navigate('/')
        }
    },[user])

    return (
        <>
            <p>{userRecipe?.recipeName}</p>
        </>
    )
}
