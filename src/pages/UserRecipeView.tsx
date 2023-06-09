
import { useContext, useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { UserRec } from './MyRecipes'
import { BrekkyContext } from '../contexts/BrekkyProvider'
import { Ingredientable } from './RecipeView'
import CuteButton from '../components/CuteButton'

const base_api_url = import.meta.env.VITE_APP_BASE_API

export default function UserRecipeView() {

    const { user, setUser } = useContext(BrekkyContext)
    const [ recipe, setRecipe ] = useState<UserRec>() 
    const { recIdParam } = useParams()
    const navigate = useNavigate()

    function handleEdit(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault()
        navigate(`/editRecipe/${recIdParam}`)
    }
    function handleDelete(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault()
        navigate(`/deleteRecipe/${recIdParam}`)
    }

    useEffect(() => {
        (async () => {
            const res = await fetch(`${base_api_url}/get/${recIdParam}`)
            if (!res.ok) {
                throw new Error("Failed to fetch")
            }
            const data = await res.json()
            const meals: UserRec = await data.recipe_user_content
            setRecipe(meals)
            console.log(meals)
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
            <div className="ml-16 mt-20 pb-1 bg-gray-900">
                <h2 className="text-center text-3xl p-5 font-extrabold text-gray-900 
                                dark:text-white md:text-5xl lg:text-6xl">
                    <span className="text-transparent bg-clip-text 
                                    bg-gradient-to-r to-sky-200 from-sky-400">
                        {recipe?.recipeName}
                    </span>
                </h2>
            </div>
            <div className="max-w-6xl font-display mx-auto p-4 bg-gray-600 flex flex-row">
                <div className="w-1/2">
                    <div className="bg-gray-700 m-8 p-6 rounded-2xl text-center">
                        <h4 className="leading-10 text-lg text-gray-300 font-semibold pb-2">Ingredient List</h4>
                        <ul role="list" className="space-y-2">
                            {
                                recipe?.ingredients.map((item: Ingredientable, index) => 
                                <li key={`ingreItem${index}`}
                                    className="leading-7 text-gray-400 font-light">
                                    {item.ingMeasure} {item.ingName}
                                </li>
                                )
                            }
                        </ul>
                    </div>
                    <div className="m-8 p-6 bg-gray-500 rounded-2xl">
                        <h4 className="leading-10 text-lg text-gray-900 text-center font-semibold pb-2 drop-shadow">Instructions</h4>
                        <p className="text-gray-800 font-light drop-shadow">{recipe?.recipeInstructions}</p>
                    </div>
                </div>
                <div className="w-1/2 p-8">
                    <img src={recipe?.recipe_thumb} alt={recipe?.recipeName}
                        className="object-cover rounded-2xl justify-center" />
                        
                        { user.token && 
                        <div className="flex flex-row justify-center my-8">
                            <div className="p-2">
                                <CuteButton 
                                    eventHandler={handleEdit}
                                    buttonDisplayName="Edit Recipe"
                                />
                            </div>
                            <div className="p-2">
                                <CuteButton 
                                    eventHandler={handleDelete}
                                    buttonDisplayName="Delete Recipe"
                                />
                            </div>
                        </div>
                        }
                </div>
            </div>

        </>
    )
}
