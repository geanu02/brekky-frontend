import { useForm, SubmitHandler } from "react-hook-form"
import CuteButton from "../components/CuteButton"
import { BrekkyContext } from "../contexts/BrekkyProvider"
import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import HeaderTitle from "../components/HeaderTitle"
import Spinner from "../components/Spinner"

const base_api_url = import.meta.env.VITE_APP_BASE_API

interface Accountable {
    email?: string
    username?: string
    first_name?: string
    last_name?: string
}

interface ISaveResponse {
    active: boolean,
    success: boolean,
    message: string
}

export default function UserSettings() {

    const { user, setUser } = useContext(BrekkyContext)
    const [ account, setAccount ] = useState<Accountable>()
    const [ updatedNames, setUpdatedNames ] = useState<Accountable>()
    const [ saveResponse, setSaveResponse ] = useState<ISaveResponse>({active: false, success: false, message: ""})
    const navigate = useNavigate()

    const { register, reset, handleSubmit } = useForm()

    useEffect(() => {
        (async () => {
            const res = await fetch(`${base_api_url}/get-user/${user.username}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': `Bearer ${user.token || localStorage.getItem('token')?.replaceAll('"', "")}`
                }
            })
            if (res.ok) {
                const data = await res.json()
                const arrData: Accountable = data[0]
                console.log(arrData)
                setAccount(arrData)
            }
        })()
    }, [])
    
    useEffect(() => {
        reset(account)
    }, [account])

    async function handleSaveAccount(data: any): Promise<SubmitHandler<Accountable>> {
        console.log(data)
        const res = await fetch(`${base_api_url}/update-account`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': `Bearer ${user.token || localStorage.getItem('token')?.replaceAll('"', "")}`
            },
            body: JSON.stringify(data)
        })
        if (res.ok) {
            const dataRes = await res.json() 
            const dr = dataRes[0]
            console.log(dr)
            if (dr.success) {
                setUpdatedNames({ 
                    first_name: dataRes['first_name'], 
                    last_name: dataRes['last_name'],
                    email: dataRes['email'],
                    username: dataRes['username']
                })
                setUser(prevState => ({ 
                    ...prevState, 
                    username: dr.username,
                    firstname: dr['first_name'] 
                }))
                setSaveResponse({
                    active: true,
                    success: dr.success,
                    message: dr.message})
            } else {
                setSaveResponse({
                    active: true,
                    success: dr.success,
                    message: dr.message
                })
            }

            
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
                    <HeaderTitle unColoredText="Account " coloredText="Settings" />
                    <form onSubmit={handleSubmit(handleSaveAccount)} className="text-center">
                        { account ? ( <>
                            <input {...register('email')} defaultValue={account.email} type="email" placeholder="Email Address" 
                            className="mb-3 py-2 px-3 rounded-md text-lg text-gray-900 bg-gray-50 border border-gray-300 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-sky-500 dark:focus:border-sky-500" />
                            <br />
                        
                            <input {...register('first_name')} type="text" placeholder="First Name" defaultValue={account.first_name}
                            className="mb-3 py-2 px-3 rounded-md text-lg text-gray-900 bg-gray-50 border border-gray-300 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-sky-500 dark:focus:border-sky-500"/>
                            <br />
                    
                            <input {...register('last_name')} type="text" placeholder="Last Name" defaultValue={account.last_name}
                            className="mb-3 py-2 px-3 rounded-md text-lg text-gray-900 bg-gray-50 border border-gray-300 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-sky-500 dark:focus:border-sky-500"/>
                            <br />
                
                            <input {...register('username')} type="text" placeholder="Username" defaultValue={account.username}
                            className="mb-3 py-2 px-3 rounded-md text-lg text-gray-900 bg-gray-50 border border-gray-300 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-sky-500 dark:focus:border-sky-500"/>
                            <br />
                
                            <input {...register('password')} type="password" placeholder="Password" disabled
                            className="mb-3 py-2 px-3 rounded-md text-lg text-gray-900 bg-gray-50 border border-gray-300 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-sky-500 dark:focus:border-sky-500"/>
                            <br />
                            </>
                            ) : (
                                <Spinner />
                            )
                        }
                        <div className="flex justify-center mb-3"><CuteButton buttonDisplayName="Save Changes" /></div>
                        <div className="flex justify-center"><CuteButton eventHandler={handleCancel} buttonDisplayName="Cancel" /></div>
                        <p className="mt-4 text-sm text-white italic">...</p>
                    </form>
                    {
                        saveResponse.active ? 
                        <div className={saveResponse.success ?
                             `bg-blue-100 border-blue-500 text-blue-700` :
                             `bg-red-100 border-red-500 text-red-700`
                                + "border-t border-b px-4 py-3 text-center mt-6"
                            } role="alert">
                            <p className="font-bold">{saveResponse.success ? "Success" : "Error"}</p>
                            <p className="text-sm">{saveResponse.message}</p>
                        </div> :
                        ''
                    }
                </div>
                
            </div>
        </>
    )
}
