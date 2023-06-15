import { BrekkyContext } from "../contexts/BrekkyProvider"
import { useContext, useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { UserRec } from "./MyRecipes"
import { useForm, SubmitHandler } from "react-hook-form"
import CuteButton from "../components/CuteButton"
import { arrToObj } from "./RecipeView"
import HeaderTitle from "../components/HeaderTitle"

const base_api_url = import.meta.env.VITE_APP_BASE_API

export default function UserRecipeEdit() {

    const { user, setUser } = useContext(BrekkyContext)
    const [ userRecipe, setUserRecipe ] = useState<UserRec>()
    const { useRecIdParam } = useParams()
    const navigate = useNavigate()

    const { register, handleSubmit } = useForm()

    async function handleSaveRecipe(data: any): Promise<SubmitHandler<UserRec>> {
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
        data._recipe_id = userRecipe?._recipe_id
        data.user_recipe_id = userRecipe?.user_recipe_id
        data.recipe_thumb = userRecipe?.recipe_thumb
        data.recipe_area = userRecipe?.recipe_area
        data.recipe_category = userRecipe?.recipe_category
        const res = await fetch(`${base_api_url}/recipe/${userRecipe?.user_recipe_id}`, {
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
            const res = await fetch(`${base_api_url}/get/${useRecIdParam}`)
            if (!res.ok) {
                throw new Error("Failed to fetch")
            }
            const data = await res.json()
            const recipeContent: UserRec = await data.recipe_user_content
            console.log(recipeContent)
            setUserRecipe(recipeContent)
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
                {
                    userRecipe !== undefined ? 
                    <HeaderTitle
                        break={true}
                        unColoredText="Personalize"
                        coloredText={userRecipe.recipeName} 
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
                            defaultValue={ userRecipe !== undefined ? userRecipe.recipeName : '' }
                        />
                    </div>
                    <div className="my-6">
                        {/* Recipe Instructions Input */}
                        <label className="block mb-4 text-md font-medium text-gray-900 dark:text-white">Your Cooking Instructions</label>
                        <textarea
                            rows={6}
                            className="block w-1/2 min-w-[400px] max-w-2xl p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-sky-500 dark:focus:border-sky-500"
                            {...register('recipeInstructions')}
                            required
                            defaultValue={ userRecipe !== undefined ? userRecipe.recipeInstructions : ''}
                            />
                    </div>
                    <div className="my-6">
                    <label className="block mb-4 text-md font-medium text-gray-900 dark:text-white">Your Ingredients List</label>
                    {/* Mapping Recipe Ingredients Input */}
                    {userRecipe?.ingredients.map((item, index) => 
                        <div key={`ingreItem${index}`}
                                className="flex flex-row">
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
                                defaultValue={item.ingMeasure}
                            />
                        </div>
                    )}
                    </div>
                    <CuteButton buttonDisplayName="Save Recipe" />
                </form>
            </div>
        </>
    )
}
