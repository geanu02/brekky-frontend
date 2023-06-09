import CuteButton from "../components/CuteButton"
import { BrekkyContext } from "../contexts/BrekkyProvider"
import { useRef, useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const base_api_url = import.meta.env.VITE_APP_BASE_API

export default function Register() {

    const emailField = useRef<HTMLInputElement>(null)
    const firstnameField = useRef<HTMLInputElement>(null)
    const lastnameField = useRef<HTMLInputElement>(null)
    const passwordField = useRef<HTMLInputElement>(null)
    const usernameField = useRef<HTMLInputElement>(null)
    const { user, setUser } = useContext(BrekkyContext)
    const navigate = useNavigate()

    async function handleRegisterForm(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        // endpoint on brekky-backend flask-app: /register-user
        const res = await fetch(`${base_api_url}/register-user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "email": emailField.current?.value,
                "first_name": firstnameField.current?.value,
                "last_name": lastnameField.current?.value,
                "username": usernameField.current?.value,
                "password": passwordField.current?.value
            })
        })
        if (res.ok) {
            const data = await res.json() 
            setUser({
                loggedIn: true, 
                username: String(usernameField.current?.value), 
                firstname: data[0].first_name,
                token: data[0].token
            })
        } else {
            console.log(await res.json())
        }
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
                <div>
                <h2 className="mb-8 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
                    Welcome to&nbsp;
                    <span className="text-transparent bg-clip-text bg-gradient-to-r to-sky-200 from-sky-400">
                    Brekky
                    </span>
                    !
                </h2>
                <form onSubmit={handleRegisterForm} className="text-center">
                    <input type="email" placeholder="Email Address" ref={emailField}
                    className="mb-3 py-2 px-3 rounded-md text-lg text-gray-900 bg-gray-50 border border-gray-300 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-sky-500 dark:focus:border-sky-500" />
                    <br />
                
                    <input type="text" placeholder="First Name" ref={firstnameField} 
                    className="mb-3 py-2 px-3 rounded-md text-lg text-gray-900 bg-gray-50 border border-gray-300 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-sky-500 dark:focus:border-sky-500"/>
                    <br />
            
                    <input type="text" placeholder="Last Name" ref={lastnameField} 
                    className="mb-3 py-2 px-3 rounded-md text-lg text-gray-900 bg-gray-50 border border-gray-300 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-sky-500 dark:focus:border-sky-500"/>
                    <br />
        
                    <input type="text" placeholder="Username" ref={usernameField} 
                    className="mb-3 py-2 px-3 rounded-md text-lg text-gray-900 bg-gray-50 border border-gray-300 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-sky-500 dark:focus:border-sky-500"/>
                    <br />
        
                    <input type="password" placeholder="Password" ref={passwordField} 
                    className="mb-3 py-2 px-3 rounded-md text-lg text-gray-900 bg-gray-50 border border-gray-300 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-sky-500 dark:focus:border-sky-500"/>
                    <br />

                    <div className="flex justify-center"><CuteButton buttonDisplayName="Register" /></div>
                </form>
                </div>
            </div>
        </>
    )
}
