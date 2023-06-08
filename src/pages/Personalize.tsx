import { useNavigate, useParams } from "react-router-dom"
import { BrekkyContext } from "../contexts/BrekkyProvider"
import { useContext, useEffect, useState } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { arrToObj } from "./RecipeView"
import { RiDeleteBin5Fill } from "react-icons/ri"
import CuteButton from "../components/CuteButton"

const base_api_url = import.meta.env.VITE_APP_BASE_API

interface Personalizable {
    userRecipeId: number,
    userRecipeTitle: string,
    userRecipeContent: RecipeContent
}

interface RecipeContent {
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
    const { useRecIdParam } = useParams()
    const navigate = useNavigate()

    const { register, handleSubmit } = useForm()

    async function handleSaveRecipe(data: any): Promise<SubmitHandler<RecipeContent>> {

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
            navigate('/myrecipes')
        }
        console.log(data)
        return data
    }

    useEffect(() => {
        (async () => {
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
            }
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
            <div className="ml-16 mt-12 p-4 bg-gray-600">
                {/* Personalize Title */}
                <h2 className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
                    Personalize<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r to-sky-200 from-sky-400">
                        {userRecipe?.userRecipeTitle}
                    </span>
                </h2>

                {/* Form Start */}
                <form onSubmit={handleSubmit(handleSaveRecipe)}>
                    <div className="my-6">

                        {/* Recipe Title Input */}
                        <label className="block mb-4 text-md font-medium text-gray-900 dark:text-white">
                            Your Recipe Title
                        </label>
                        <input
                            className="w-1/2 min-w-[400px] max-w-2xl py-1 px-2 rounded-md text-sm text-gray-900 bg-gray-50 border border-gray-300 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-sky-500 dark:focus:border-sky-500"
                            {...register('recipeName', { 
                                required: "Recipe Title required.",
                                minLength: {
                                    value: 1,
                                    message: "Minimum Length is 1 character."
                                }
                            })}
                            type="text"
                            defaultValue={userRecipe?.userRecipeContent.newRecipeTitle || userRecipe?.userRecipeTitle}
                        />
                    </div>
                    <div className="my-6">
                        {/* Recipe Instructions Input */}
                        <label className="block mb-4 text-md font-medium text-gray-900 dark:text-white">Your Cooking Instructions</label>
                        <textarea
                            rows={6}
                            className="block w-1/2 min-w-[400px] max-w-2xl p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-sky-500 dark:focus:border-sky-500"
                            {...register('recipeInstructions', { 
                                required: "Cooking Instructions required.",
                                minLength: {
                                    value: 5,
                                    message: "Minimum Length is 5 characters."
                                }
                            })}
                            defaultValue={userRecipe?.userRecipeContent.strInstructions}
                            />
                    </div>
                    <div className="my-6">
                    <label className="block mb-4 text-md font-medium text-gray-900 dark:text-white">Your Ingredients List</label>
                    {/* Mapping Recipe Ingredients Input */}
                    {userRecipe?.userRecipeContent.ingredients.map((item, index) => 
                        <div key={`ingreItem${index}`}
                                className="flex flex-row">
                            <input
                                {...register(`ingreName${index}`, { 
                                    required: "Ingredient Name required. Delete row if blank.",
                                    minLength: {
                                        value: 1,
                                        message: "Minimum Length is 1 character."
                                    }
                                })}
                                type="text"
                                className="mr-3 mb-3 py-1 px-2 rounded-md text-sm text-gray-900 bg-gray-50 border border-gray-300 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-sky-500 dark:focus:border-sky-500"
                                defaultValue={item.ingName}
                            />
                            <input
                                {...register(`ingreMeas${index}`, { 
                                    required: "Ingredient Measurement required. Delete row if blank.",
                                    minLength: {
                                        value: 1,
                                        message: "Minimum Length is 1 character."
                                    }
                                })}
                                type="text"
                                className="mr-3 mb-3 py-1 px-2 rounded-md text-sm text-gray-900 bg-gray-50 border border-gray-300 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-sky-500 dark:focus:border-sky-500"
                                defaultValue={item.ingMeasure}
                            />
                            <RiDeleteBin5Fill size="20" className="m-1 text-sky-600 hover:text-red-900 transition-all duration-200 ease-linear cursor-pointer" />
                        </div>
                    )}
                    </div>
                    <CuteButton buttonDisplayName="Save Recipe" />
                </form>
            </div>
        </>
    )
}
