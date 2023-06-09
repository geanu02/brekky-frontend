import Spinner from "../components/Spinner"
import RecipeCard from "../components/RecipeCard"
import { useEffect, useState } from "react"

export interface RecipeCardable {
    idMeal: string,
    strMeal: string,
    strMealThumb: string,
    linkTo: string
}

const base_meals_api_url = import.meta.env.VITE_BASE_MEAL_API_URL

export default function Home() {

    const [ arrRecipes, setArrRecipes ] = useState<RecipeCardable[]>([])

    useEffect(() => {
        (async () => {
            const res = await fetch(`${base_meals_api_url}/filter.php?c=Seafood`)
            if (!res.ok) {
                throw new Error("Failed to fetch")
            }
            const data = await res.json()
            const arrData: RecipeCardable[] = await data.meals
            setArrRecipes(arrData)
            console.log(arrData)
        })()
    },[])
    
    return (
        <>
            <div className="ml-16 mt-12 p-4 bg-gray-600">
                <h2 className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
                    Browse&nbsp;
                    <span className="text-transparent bg-clip-text bg-gradient-to-r to-sky-200 from-sky-400">
                    Recipes
                    </span>
                </h2>
                <div className="flex flex-row flex-wrap justify-between items-start">
                { 
                    arrRecipes.length > 1 ? (
                    arrRecipes.map((item, index) => 
                        <RecipeCard 
                            key={`recipeCard${index}`}
                            idMeal={item.idMeal}
                            strMeal={item.strMeal}
                            strMealThumb={item.strMealThumb}
                            linkTo={`recipe`}
                        />
                    )) : (
                        <Spinner />
                    )
                }
                </div>
            </div>
        </>
    )
}