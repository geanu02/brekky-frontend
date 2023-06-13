import { useForm, SubmitHandler } from "react-hook-form"
import CuteButton from "../components/CuteButton"
import { BrekkyContext } from "../contexts/BrekkyProvider"
import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const base_api_url = import.meta.env.VITE_APP_BASE_API

interface Accountable {
    email?: string,
    first_name: string,
    last_name: string
}

export default function UserSettings() {

    const { user, setUser } = useContext(BrekkyContext)
    const [ account, setAccount ] = useState<Accountable>()
    const [ updatedNames, setUpdatedNames ] = useState<Accountable>()
    const navigate = useNavigate()

    const { register, handleSubmit } = useForm()

    useEffect(() => {
        (async () => {
            const res = await fetch(`${base_api_url}/get-user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': `Bearer ${user.token || localStorage.getItem('token')?.replaceAll('"', "")}`
                },
                body: JSON.stringify({
                    "username": user.username
                })
            })
            if (res.ok) {
                const data: Accountable = await res.json()
                console.log(data)
                setAccount(data)
            }
        })()
    }, [])

    async function handleSaveAccount(data: any): Promise<SubmitHandler<Accountable>> {
        const res = await fetch(`${base_api_url}/update-names`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': `Bearer ${user.token || localStorage.getItem('token')?.replaceAll('"', "")}`
            },
            body: JSON.stringify(data)
        })
        if (res.ok) {
            const dataRes = await res.json() 
            setUpdatedNames({ 
                first_name: dataRes['first_name'], 
                last_name: dataRes['last_name'] 
            })
            setUser(prevState => ({ ...prevState, firstname: dataRes['first_name'] }))
        }
        return data
    }

    function handleCancel() {
        navigate(-1)
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
        <>
            <div className="grid place-items-center h-screen">
                <div>
                    <h2 className="mb-8 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
                        Account&nbsp;
                        <span className="text-transparent bg-clip-text bg-gradient-to-r to-sky-200 from-sky-400">
                        Settings
                        </span>
                    </h2>
                    <form onSubmit={handleSubmit(handleSaveAccount)} className="text-center">
                        <input {...register('email')} defaultValue={account?.email} type="email" placeholder="Email Address" 
                        className="mb-3 py-2 px-3 rounded-md text-lg text-gray-900 bg-gray-50 border border-gray-300 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-sky-500 dark:focus:border-sky-500" disabled />
                        <br />
                    
                        <input {...register('first_name')} type="text" placeholder="First Name" defaultValue={account?.first_name}
                        className="mb-3 py-2 px-3 rounded-md text-lg text-gray-900 bg-gray-50 border border-gray-300 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-sky-500 dark:focus:border-sky-500"/>
                        <br />
                
                        <input {...register('last_name')} type="text" placeholder="Last Name" defaultValue={account?.last_name}
                        className="mb-3 py-2 px-3 rounded-md text-lg text-gray-900 bg-gray-50 border border-gray-300 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-sky-500 dark:focus:border-sky-500"/>
                        <br />
            
                        <input {...register('username')} type="text" placeholder="Username" defaultValue={user.username}
                        className="mb-3 py-2 px-3 rounded-md text-lg text-gray-900 bg-gray-50 border border-gray-300 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-sky-500 dark:focus:border-sky-500" disabled/>
                        <br />
            
                        <input {...register('password')} type="password" placeholder="Password" disabled
                        className="mb-3 py-2 px-3 rounded-md text-lg text-gray-900 bg-gray-50 border border-gray-300 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-sky-500 dark:focus:border-sky-500"/>
                        <br />

                        <div className="flex justify-center mb-3"><CuteButton buttonDisplayName="Save Changes" /></div>
                        <div className="flex justify-center"><CuteButton eventHandler={handleCancel} buttonDisplayName="Cancel" /></div>
                        <p className="mt-4 text-sm text-white italic">For now, users are only allowed to change their first and last names.</p>
                    </form>
                    {
                        updatedNames ? 
                        <div className="bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3 text-center mt-6" role="alert">
                            <p className="font-bold">Success</p>
                            <p className="text-sm">Changed name to {updatedNames.first_name}&nbsp;{updatedNames.last_name}.</p>
                        </div> :
                        ''
                    }
                </div>
                
            </div>
        </>
    )
}
