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
            <div className="ml-16 mt-12 p-4 bg-gray-600">
                <h2 className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
                    Welcome to&nbsp;
                    <span className="text-transparent bg-clip-text bg-gradient-to-r to-sky-200 from-sky-400">
                    Brekky
                    </span>
                    !
                </h2>
                <form onSubmit={handleRegisterForm}>
                    <label>Email:<br />
                        <input type="email" ref={emailField} />
                    </label><br /><br />
                    <label>First Name:<br />
                        <input type="text" ref={firstnameField} />
                    </label><br /><br />
                    <label>Last Name:<br />
                        <input type="text" ref={lastnameField} />
                    </label><br /><br />
                    <label>Username:<br />
                        <input type="text" ref={usernameField} />
                    </label><br /><br />
                    <label>Password:<br />
                        <input type="password" ref={passwordField} />
                    </label><br /><br />
                    <CuteButton buttonDisplayName="Register" />
                </form>
            </div>
        </>
    )
}
