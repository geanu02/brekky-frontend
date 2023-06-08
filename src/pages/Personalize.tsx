import { useNavigate, useParams } from "react-router-dom"
import { BrekkyContext } from "../contexts/BrekkyProvider"
import { useContext, useEffect, useState } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import CuteButton from "../components/CuteButton"

const base_api_url = import.meta.env.VITE_APP_BASE_API

interface Personalizable {
    userRecipeId: number,
    userRecipeName
    userRecipeContent: RecipeContent
}

interface RecipeContent {
    ingredients: Ingredients[],
    strMeal: string,
    strMealThumb: string,
    strInstructions: string,
    idMeal: string,
    dateModified?: Date,
}

interface Ingredients {
    ingMeasure: string,
    ingName: string
}

export default function Personalize() {

    const { user, setUser } = useContext(BrekkyContext)
    const [ userRecipe, setUserRecipe ] = useState<Personalizable>()
    const { useRecIdParam } = useParams()
    const navigate = useNavigate()

    const { register, handleSubmit } = useForm()

    function handleSaveRecipe(data: any): SubmitHandler<RecipeContent> {
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
                    userRecipeContent: userRecipeData
                })
                setUserRecipe({
                    userRecipeId: data.user_recipe_id,
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
                <h2 className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
                    Personalize<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r to-sky-200 from-sky-400">
                        {userRecipe?.strMeal}
                    </span>
                </h2>
                <form onSubmit={handleSubmit(handleSaveRecipe)}>
                    <div className="my-6">
                        <label className="block mb-4 text-md font-medium text-gray-900 dark:text-white">
                            Your Recipe Title
                        </label>
                        <input
                            className="w-1/2 min-w-[400px] py-1 px-2 rounded-md text-sm text-gray-900 bg-gray-50 border border-gray-300 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-sky-500 dark:focus:border-sky-500"
                            {...register('recipeName', { 
                                required: "Recipe Title required.",
                                minLength: {
                                    value: 1,
                                    message: "Minimum Length is 1 character."
                                }
                            })}
                            type="text"
                            defaultValue={`${userRecipe?.userRecipeContent.strMeal}`}
                        />
                    </div>
                    <div className="my-6">
                        <label className="block mb-4 text-md font-medium text-gray-900 dark:text-white">Cooking Instructions</label>
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
                    <label className="block mb-4 text-md font-medium text-gray-900 dark:text-white">Ingredients List</label>
                    {userRecipe?.userRecipeContent.ingredients.map((item, index) => 
                        <div key={`ingreItem${index}`}>
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
                            <span>Delete Icon Here</span>
                        </div>
                    )}
                    </div>
                    <CuteButton buttonDisplayName="Save Recipe" />
                </form>
            </div>
        </>
    )
}
