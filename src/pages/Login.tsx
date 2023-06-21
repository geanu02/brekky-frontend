import Spinner from "../components/Spinner"
import CuteButton from "../components/CuteButton"
import { BrekkyContext } from "../contexts/BrekkyProvider"
import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import HeaderTitle from "../components/HeaderTitle"
import { SubmitHandler, useForm } from "react-hook-form"

const base_api_url = import.meta.env.VITE_APP_BASE_API

interface Accountable {
    username: string,
    password: string
}

export default function Login() {

    const { user, setUser } = useContext(BrekkyContext)
    const [ loading, setLoading ] = useState<boolean>(false)
    const navigate = useNavigate()

    const { register, handleSubmit } = useForm()

    async function handleLoginForm(data: any): Promise<SubmitHandler<Accountable>> {
        setLoading(true)
        // endpoint on brekky-backend flask-app: /verify-user
        const res = await fetch(`${base_api_url}/verify-user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        if (res.ok) {
            const dataRes = await res.json() 
            setUser({
                loggedIn: true, 
                username: dataRes[0].username, 
                firstname: dataRes[0].first_name,
                token: dataRes[0].token
            })
            setLoading(false)
        } else {
            setLoading(false)
        }
        return data
    }

    useEffect(() => {
        if (user.token) { 
            localStorage.setItem('token', JSON.stringify(user.token))
            localStorage.setItem('firstname', JSON.stringify(user.firstname))
            localStorage.setItem('username', JSON.stringify(user.username))
            navigate('/myrecipes') 
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
            navigate('/myrecipes')
        }
    },[user])

    return (
        <>
            { loading ? ( <Spinner /> ) :
            (
                <div className="h-screen flex flex-row justify-center items-center">
                    <div>
                        <HeaderTitle unColoredText="Welcome back to " coloredText="Brekky" />
                    <form onSubmit={handleSubmit(handleLoginForm)} >
                        <div className="flex wrap flex-row justify-center ">
                            <div>
                                <input {...register('username')} type="text" placeholder="Username"
                        className="mr-3 mb-3 py-2 px-3 rounded-md text-lg text-gray-900 bg-gray-50 border border-gray-300 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-sky-500 dark:focus:border-sky-500"/></div>
                        
                        
                        <div><input {...register('password')} type="password" placeholder="Password"
                        className="mr-3 mb-3 py-2 px-3 rounded-md text-lg text-gray-900 bg-gray-50 border border-gray-300 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-sky-500 dark:focus:border-sky-500"/></div>
                        
                        <div><p><CuteButton buttonDisplayName="Login" /></p></div>
                        </div>
                    </form></div>
                </div>
            )}
        </>
    )
}
