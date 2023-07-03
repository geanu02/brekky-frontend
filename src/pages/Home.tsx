import Spinner from "../components/Spinner"
import RecipeCard from "../components/RecipeCard"
import { useEffect, useState } from "react"
import HeaderTitle from "../components/HeaderTitle"

export interface RecipeCardable {
    idMeal: string,
    strMeal: string,
    strMealThumb: string,
    linkTo: string
}

const base_meals_api_url = import.meta.env.VITE_BASE_MEAL_API_URL

export default function Home() {

    const [ arrRecipes, setArrRecipes ] = useState<RecipeCardable[]>([])
    const [ loading, setLoading ] = useState<boolean>(false)

    useEffect(() => {
        (async () => {
            setLoading(true)
            const res = await fetch(`${base_meals_api_url}/filter.php?c=Chicken`)
            if (!res.ok) {
                throw new Error("Failed to fetch")
            }
            const data = await res.json()
            const arrData: RecipeCardable[] = await data.meals
            setArrRecipes(arrData)
            setLoading(false)
            console.log(arrData)
        })()
    },[])
    
    return (
        <>
            <div className="ml-16 mt-12 p-4 bg-gray-600">
                <HeaderTitle unColoredText="Browse&nbsp;" coloredText="Recipes" />
                <div className="flex flex-row flex-wrap justify-between items-start" >
                { 
                    loading ? ( 
                        <Spinner />
                    ) : (
                        arrRecipes.map((item, index) => 
                        <RecipeCard 
                            key={`recipeCard${index}`}
                            idMeal={item.idMeal}
                            strMeal={item.strMeal}
                            strMealThumb={item.strMealThumb}
                            linkTo={`recipe`}
                        />
                    )
                    )
                }
                </div>
            </div>
        </>
    )
}