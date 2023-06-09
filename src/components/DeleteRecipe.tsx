import { BrekkyContext } from "../contexts/BrekkyProvider"
import { useContext, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import CuteButton from "./CuteButton"

const base_api_url = import.meta.env.VITE_APP_BASE_API

export default function DeleteRecipe() {

    const { user, setUser } = useContext(BrekkyContext)
    const { deleteId } = useParams()
    const navigate = useNavigate()
    const goBack = () => navigate(-1)

    async function handleDeleteRecipe() {
        const res = await fetch(`${base_api_url}/recipe/${deleteId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': `Bearer ${user.token || localStorage.getItem('token')?.replaceAll('"', "")}`
            }
        })
        if (res.ok) {
            const dataRes = await res.json() 
            console.log(dataRes)
            navigate('/myrecipes')
        }
    }

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
    }, [user])

    return (
        <div className="grid place-items-center h-screen">
            <div className="rounded-md bg-gray-900 p-8">
                <p className="p-4 text-sky-600">Are you sure you want to delete this recipe?</p>
                <div className="flex flex-row">
                <div className="p-2">
                    <CuteButton eventHandler={handleDeleteRecipe} buttonDisplayName="Delete"/></div>
                <div className="p-2">
                    <CuteButton eventHandler={goBack} buttonDisplayName="Cancel"/></div>
                </div>
            </div>
        </div>
    )
}
