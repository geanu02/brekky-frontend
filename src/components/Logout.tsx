import { useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { BrekkyContext } from "../contexts/BrekkyProvider"


export default function Logout() {

    const { setUser } = useContext(BrekkyContext)
    const navigate = useNavigate()

    useEffect(() => {
        setUser({
            loggedIn: false,
            username: "",
            firstname: "",
            token: ""
        })
        localStorage.removeItem('token')
        localStorage.removeItem('username')
        localStorage.removeItem('firstname')
        navigate('/login')
    }, [])

    return (
    <>
        <div className="ml-16 mt-12 p-4 bg-gray-600">
            <h2>Logout Page</h2>
        </div>
    </>
    )
}
