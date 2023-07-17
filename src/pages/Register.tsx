import CuteButton from "../components/CuteButton"
import HeaderTitle from "../components/HeaderTitle"
import { BrekkyContext } from "../contexts/BrekkyProvider"
import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { SubmitHandler, useForm } from "react-hook-form"
import Spinner from "../components/Spinner"

const base_api_url = import.meta.env.VITE_APP_BASE_API

interface Registerable {
    email: string,
    firstname: string,
    lastname: string,
    username: string,
    password: string
}

interface IRegisterResponse {
    active: boolean,
    success: boolean,
    message: string
}

export default function Register() {
    const { register, handleSubmit } = useForm()
    const [ loading, setLoading ] = useState<boolean>(false)
    const [ registerResponse, setRegisterResponse ] = useState<IRegisterResponse>({active: false, success: false, message: ""})
    const { user, setUser } = useContext(BrekkyContext)
    const navigate = useNavigate()

    async function handleRegisterForm(data: any): Promise<SubmitHandler<Registerable>> {
        setLoading(true)
        // endpoint on brekky-backend flask-app: /register-user
        const res = await fetch(`${base_api_url}/register-user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        if (res.ok) {
            const dataRes = await res.json() 
            if (dataRes[0].success) {
                setUser({
                    loggedIn: true, 
                    username: dataRes[0].username, 
                    firstname: dataRes[0].first_name,
                    token: dataRes[0].token
                })
            } else if (dataRes[0].success === false) {
                setRegisterResponse({
                    active: true,
                    success: false,
                    message: dataRes[0].message
                })
            }
            setLoading(false)
        } else {
            console.log("res.ok = false")
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
            <div className="grid place-items-center h-screen">
                { loading ? (
                    <Spinner />
                ) : (
                    <div>
                    <HeaderTitle unColoredText="Welcome to " coloredText="Brekky!"/>
                    <form onSubmit={handleSubmit(handleRegisterForm)} className="text-center">
                        <input {...register('email')} type="email" placeholder="Email Address"
                        className="mb-3 py-2 px-3 rounded-md text-lg text-gray-900 bg-gray-50 border border-gray-300 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-sky-500 dark:focus:border-sky-500" />
                        <br />
                    
                        <input {...register('first_name')} type="text" placeholder="First Name"
                        className="mb-3 py-2 px-3 rounded-md text-lg text-gray-900 bg-gray-50 border border-gray-300 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-sky-500 dark:focus:border-sky-500"/>
                        <br />
                
                        <input {...register('last_name')} type="text" placeholder="Last Name"
                        className="mb-3 py-2 px-3 rounded-md text-lg text-gray-900 bg-gray-50 border border-gray-300 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-sky-500 dark:focus:border-sky-500"/>
                        <br />
            
                        <input {...register('username')} type="text" placeholder="Username"
                        className="mb-3 py-2 px-3 rounded-md text-lg text-gray-900 bg-gray-50 border border-gray-300 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-sky-500 dark:focus:border-sky-500"/>
                        <br />
            
                        <input {...register('password')} type="password" placeholder="Password"
                        className="mb-3 py-2 px-3 rounded-md text-lg text-gray-900 bg-gray-50 border border-gray-300 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-sky-500 dark:focus:border-sky-500"/>
                        <br />

                        <div className="flex justify-center"><CuteButton buttonDisplayName="Register" /></div>
                    </form>
                    {
                        registerResponse.active ?
                        <div className={registerResponse.success ?
                                `bg-blue-100 border-blue-500 text-blue-700` :
                                `bg-red-100 border-red-500 text-red-700`
                                + "border-t border-b px-4 py-3 text-center mt-6"
                            } role="alert">
                            <p className="font-bold">{registerResponse.success ? "Success" : "Error"}</p>
                            <p className="text-sm">{registerResponse.message}</p>
                        </div> :
                        ''
                    }
                    </div>
                )}
            </div>
        </>
    )
}
