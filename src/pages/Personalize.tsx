import { useNavigate, useParams } from "react-router-dom"
import { BrekkyContext } from "../contexts/BrekkyProvider"
import { useContext, useEffect, useState } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { arrToObj } from "./RecipeView"
import CuteButton from "../components/CuteButton"
import Spinner from "../components/Spinner"
import HeaderTitle from "../components/HeaderTitle"
import Uploader from "../components/Uploader"

const base_api_url = import.meta.env.VITE_APP_BASE_API

interface Personalizable {
    userRecipeId: number,
    userRecipeTitle: string,
    userRecipeContent: RecipeContent
}

export interface RecipeContent {
    ingredients: Ingredients[],
    strMeal: string,
    strMealThumb: string,
    strInstructions: string,
    idMeal: string,
    dateModified?: Date,
    newRecipeTitle?: string,
    strArea: string,
    strCategory: string
}

export interface Ingredients {
    ingMeasure: string,
    ingName: string
}

export default function Personalize() {

    const { user, setUser } = useContext(BrekkyContext)
    const [ userRecipe, setUserRecipe ] = useState<Personalizable>()
    const [ loading, setLoading ] = useState<boolean>(false)
    const { useRecIdParam } = useParams()
    const navigate = useNavigate()

    const { register, reset, handleSubmit } = useForm()

    async function handleSaveRecipe(data: any): Promise<SubmitHandler<RecipeContent>> {
        setLoading(true)
        const ls_ingName: string[] = []
        const ls_ingMeas: string[] = []
        for (let k in data) {
            if (k.includes('ingreName') && data[k] !== null) {
                ls_ingName.push(data[k] as string)
                delete data[k]
            } else if (k.includes('ingreMeas') && data[k] !== null) {
                ls_ingMeas.push(data[k] as string)
                delete data[k]
            }
        }
        data.ingredients = arrToObj(ls_ingName as [], ls_ingMeas as [])
        data.dateModified = Date.now()
        data._recipe_id = parseInt(userRecipe?.userRecipeContent.idMeal!)
        data.user_recipe_id = userRecipe?.userRecipeId
        data.recipe_thumb = userRecipe?.userRecipeContent.strMealThumb
        data.recipe_area = userRecipe?.userRecipeContent.strArea
        data.recipe_category = userRecipe?.userRecipeContent.strCategory
        const res = await fetch(`${base_api_url}/recipe/${userRecipe?.userRecipeId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': `Bearer ${user.token || localStorage.getItem('token')?.replaceAll('"', "")}`
            },
            body: JSON.stringify(data)
        })
        if (res.ok) {
            const dataRes = await res.json() 
            console.log(dataRes)
            setLoading(false)
            navigate('/myrecipes')
        }
        else {
            setLoading(false)
        }
        console.log(data)
        return data
    }

    async function handleCancel() {
        const res = await fetch(`${base_api_url}/recipe/${useRecIdParam}`, {
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
        (async () => {
            setLoading(true)
            const res = await fetch(`${base_api_url}/get/${useRecIdParam}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': `Bearer ${user.token || localStorage.getItem('token')?.replaceAll('"', "")}`
                }
            })
            if (res.ok) {
                const data = await res.json()
                const userRecipeData: RecipeContent = await data.recipe_user_content
                console.log({
                    userRecipeId: data.user_recipe_id,
                    userRecipeTitle: data.recipe_title,
                    userRecipeContent: userRecipeData
                })
                setUserRecipe({
                    userRecipeId: data.user_recipe_id,
                    userRecipeTitle: data.recipe_title,
                    userRecipeContent: userRecipeData
                })
                setLoading(false)
            }
        })()
    }, [])

    useEffect(() => {
        reset(userRecipe)
    }, [userRecipe])

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
            { loading ? ( <Spinner /> ) :
            (<>
            <div className="ml-16 mt-12 p-4 bg-gray-600">
                {/* Personalize Title */}
                {
                    userRecipe !== undefined ? 
                    <HeaderTitle
                        break={true}
                        unColoredText="Personalize"
                        coloredText={userRecipe?.userRecipeTitle} 
                    /> :
                    <div>No Recipe Header</div>
                }
                
                {/* Form Start */}
                <form onSubmit={handleSubmit(handleSaveRecipe)}>
                    <div className="my-6">
                        {/* Recipe Title Input */}
                        <label className="block mb-4 text-md font-medium text-gray-900 dark:text-white">
                            Your Recipe Title
                        </label>
                        <input
                            className="w-1/2 min-w-[400px] max-w-2xl py-1 px-2 rounded-md text-sm text-gray-900 bg-gray-50 border border-gray-300 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-sky-500 dark:focus:border-sky-500"
                            {...register('recipeName')}
                            type="text"
                            required
                            defaultValue={ 
                                userRecipe !== undefined ? 
                                userRecipe.userRecipeContent.newRecipeTitle || userRecipe.userRecipeTitle :
                                ''
                            }
                        />
                    </div>
                    <div className="my-6">
                        {/* Recipe Instructions Input */}
                        <label className="block mb-4 text-md font-medium text-gray-900 dark:text-white">Your Cooking Instructions</label>
                        <textarea
                            {...register('recipeInstructions')}
                            rows={6}
                            className="block w-1/2 min-w-[400px] max-w-2xl p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-sky-500 dark:focus:border-sky-500"
                            required
                            defaultValue={
                                userRecipe !== undefined ? 
                                userRecipe.userRecipeContent.strInstructions :
                                ''
                                }
                            />
                    </div>
                    <div className="my-6">
                    <label className="block mb-4 text-md font-medium text-gray-900 dark:text-white">Your Ingredients List</label>
                    {/* Mapping Recipe Ingredients Input */}
                    {userRecipe && userRecipe.userRecipeContent.ingredients.map((item, index) => 
                        <div key={`ingreItem${index}`} className="flex flex-row">
                            <input
                                {...register(`ingreName${index}`)}
                                type="text"
                                className="mr-3 mb-3 py-1 px-2 rounded-md text-sm text-gray-900 bg-gray-50 border border-gray-300 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-sky-500 dark:focus:border-sky-500"
                                required
                                defaultValue={item.ingName}
                            />
                            <input
                                {...register(`ingreMeas${index}`)}
                                type="text"
                                className="mr-3 mb-3 py-1 px-2 rounded-md text-sm text-gray-900 bg-gray-50 border border-gray-300 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-sky-500 dark:focus:border-sky-500"
                                required
                                defaultValue={item.ingMeasure} />
                        </div>
                    )}
                    </div>
                    <div>
                        <Uploader />
                    </div>
                    <div className="p-2"><CuteButton buttonDisplayName="Save Recipe" /></div>
                    <div className="p-2"><CuteButton eventHandler={handleCancel} buttonDisplayName="Cancel" /></div>
                </form>
            </div>
            </>)}
        </>
    )
}
