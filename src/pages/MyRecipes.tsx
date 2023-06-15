import { BrekkyContext } from "../contexts/BrekkyProvider"
import { useContext, useEffect, useState } from "react"
import { Ingredients } from "./Personalize"
import RecipeCard from "../components/RecipeCard"
import Spinner from "../components/Spinner"
import HeaderTitle from "../components/HeaderTitle"

const base_api_url = import.meta.env.VITE_APP_BASE_API

export interface UserRecs {
    recipe_user_content: UserRec
}

export interface UserRec {
    user_recipe_id: number,
    dateModified: Date,
    recipeName: string,
    recipe_thumb: string,
    ingredients: Ingredients[],
    recipeInstructions: string,
    _recipe_id: number,
    recipe_category: string,
    recipe_area: string
}

export default function MyRecipes() {

    const { user, setUser } = useContext(BrekkyContext)
    const [ userRecipes, setUserRecipes ] = useState<UserRec[]>([])
    const [ loading, setLoading ] = useState<boolean>(false)
    
    useEffect(() => {
        (async () => {
            setLoading(true)
            const res = await fetch(`${base_api_url}/getall/${user.username}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': `Bearer ${user.token || localStorage.getItem('token')?.replaceAll('"', "")}`
                }
            })
            if (!res.ok) {
                throw new Error("Failed to fetch")
            }
            const data = await res.json()
            const userRecis: UserRecs[] = await data
            console.log(userRecis)
            const arr: UserRec[] = []
            for (let k of userRecis) {
                arr.push(k.recipe_user_content)
            }
            setUserRecipes(arr)
            setLoading(false)
        })()
    },[])

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
    },[user])

    return (
        <>
            <div className="ml-16 mt-12 p-4 bg-gray-600">
                <HeaderTitle 
                    unColoredText={`${user.firstname}'s `} 
                    coloredText="Recipes"
                />
                <div className="flex flex-row flex-wrap items-start">
                {
                    loading 
                    ? (
                       <Spinner />
                    ) : (
                        userRecipes.length === 0 
                       ? (<div>No Recipes here.</div>)
                       : (userRecipes.map((item, index) => 
                            <RecipeCard 
                                key={`userRecipeCard${index}`}
                                idMeal={String(item.user_recipe_id)}
                                strMeal={item.recipeName}
                                strMealThumb={item.recipe_thumb}
                                linkTo={`userRecipe`}
                            />)
                        )
                    )
                }
                </div>
            </div>
        </>
    )
}