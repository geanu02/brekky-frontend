import { useNavigate, useParams } from "react-router-dom"
import { BrekkyContext } from "../contexts/BrekkyProvider"
import { useContext, useEffect, useState } from "react"

const base_api_url = import.meta.env.VITE_APP_BASE_API

interface Personalizable {
    userRecipeId: number,
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
                Personalize {userRecipe?.userRecipeContent.strMeal}
                <form >
                    <label>Your Recipe Title:<br />
                        <input
                            type="text"
                            value={user.firstname + "'s " + userRecipe?.userRecipeContent.strMeal}
                         />
                    </label><br />
                    <br />
                    <label>Instructions:<br />
                        <textarea
                            value={userRecipe?.userRecipeContent.strInstructions}
                         />
                    </label>
                    <br />
                    <br />
                    <p>Ingredients:</p>
                    {userRecipe?.userRecipeContent.ingredients.map(item => 
                        <div>
                            <label>Ingredient:
                            <input
                                type="text"
                                value={item.ingName}
                            />
                        </label>
                        <label>Measurement:
                            <input
                                    type="text"
                                    value={item.ingMeasure}
                                />
                        </label>
                        </div>)}
                    <br />
                    <button type="submit">Submit</button>
                </form>
            </div>
        </>
    )
}
