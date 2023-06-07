import { BrekkyContext } from "../contexts/BrekkyProvider"
import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

export interface RecipeViewable {
    idMeal: string,
    strMeal: string,
    strCategory: string,
    strArea: string,
    strInstructions: string,
    strMealThumb: string,
    strTags: string,
    ingredients: object[]
}

interface Ingredientable {
    ingName?: string,
    ingMeasure?: string
}

const base_meals_api_url = import.meta.env.VITE_BASE_MEAL_API_URL
const base_api_url = import.meta.env.VITE_APP_BASE_API

const arrToObj = (keyArr: [], valArr: []): Ingredientable[] => {
    const returnArr: Ingredientable[] = []
    keyArr.forEach((item, index) => {
        let obj: Ingredientable = {}
        obj.ingName = item
        obj.ingMeasure = valArr[index]

        returnArr.push(obj)
    })
    return returnArr
}

export default function RecipeView() {

    const { user, setUser } = useContext(BrekkyContext)
    const [ recipe, setRecipe ] = useState<RecipeViewable>() 
    const { recIdParam } = useParams()
    const navigate = useNavigate()

    async function handleAdd(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault()
        // endpoint on brekky-backend flask-app: /add
        const res = await fetch(`${base_api_url}/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': `Bearer ${user.token || localStorage.getItem('token')?.replaceAll('"', "")}`
            },
            body: JSON.stringify({
                "recipe_id": recipe?.idMeal,
                "recipe_title": recipe?.strMeal,
                "recipe_thumb": recipe?.strMealThumb,
                "recipe_api_content": recipe,
                "recipe_user_content": recipe,
                "recipe_api_url": ""
            })
        })
        if (res.ok) {
            const data = await res.json() 
            console.log(data)
            navigate(`/personalize/${data.userRecipeId}`)
        }
    }

    useEffect(() => {
        (async () => {
            const res = await fetch(`${base_meals_api_url}/lookup.php?i=${recIdParam}`)
            if (!res.ok) {
                throw new Error("Failed to fetch")
            }
            const data = await res.json()
            const meals: RecipeViewable = await data.meals[0]
            const ls_ingName: string[] = []
            const ls_ingMeas: string[] = []
            let k: keyof RecipeViewable
            for (k in meals) {
                if (k.includes('strIngredient') && meals[k] !== null) {
                    ls_ingName.push(meals[k] as string)
                    delete meals[k]
                } else if (k.includes('strMeasure') && meals[k] !== null) {
                    ls_ingMeas.push(meals[k] as string)
                    delete meals[k]
                }
            }
            const listIng = ls_ingName.filter((str) => str !== '')
            const listMea = ls_ingMeas.filter((str) => str !== '')
            meals.ingredients = arrToObj(listIng as [], listMea as [])
            console.log(meals)
            setRecipe(meals)
        })()
    }, [])

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
            
            <div className="ml-16 mt-20 p-4 bg-gray-900">
                <h2 className="text-6xl text-center text-gray-400
                                font-display font-black">
                {recipe?.strMeal}
                </h2>
            </div>
            
            <div className="min-w-fit font-display
                    ml-16 p-4 bg-gray-600
                    flex flex-row">
                
                <div className="w-1/2">
                    <div className="bg-gray-700 m-8 p-6 rounded-2xl text-center">
                        <h4 className="leading-10 text-lg text-gray-300 font-semibold pb-2">Ingredient List</h4>
                        <ul role="list" className="space-y-2">
                            {
                                recipe?.ingredients.map((item: Ingredientable) => 
                                <li className="leading-7 text-gray-400 font-light">{item.ingMeasure} {item.ingName}</li>)
                            }
                        </ul>
                    </div>
                    <div className="m-8 p-6 bg-gray-500 rounded-2xl">
                        <h4 className="leading-10 text-lg text-gray-900 text-center font-semibold pb-2 drop-shadow">Instructions</h4>
                        <p className="text-gray-800 font-light drop-shadow">{recipe?.strInstructions}</p>
                    </div>
                </div>
                <div className="w-1/2 p-8">
                    <img src={recipe?.strMealThumb} alt={recipe?.strMealThumb}
                        className="object-cover rounded-2xl" />
                    { user.token && 
                        <div className="flex flex-row justify-center my-8 ">
                            <button onClick={handleAdd} 
                                    className="bg-gray-800 text-lg font-medium text-sky-600 border-2
                                                border-gray-800 px-12 py-2 rounded-full
                                                hover:text-white group relative flex items-center
                                                overflow-hidden">
                                <span className="absolute left-0 w-full h-0 transition-all
                                                bg-sky-600 opacity-100 group-hover:h-full
                                                group-hover:top-0 duration-400 ease"></span>
                                <span className="relative">Personalize Recipe</span>
                            </button>
                        </div>
                    }
                </div>
            </div>
            
        </>
    )
}
