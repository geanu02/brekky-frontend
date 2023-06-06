import RecipeCard from "../components/RecipeCard"
import { useEffect, useState } from "react"

export interface RecipeCardable {
    idMeal: string,
    strMeal: string,
    strMealThumb: string
}

const base_meals_api_url = import.meta.env.VITE_BASE_MEAL_API_URL

export default function Home() {

    const [ seafoodList, setSeafoodList ] = useState<RecipeCardable[]>([])

    useEffect(() => {
        (async () => {
            const res = await fetch(`${base_meals_api_url}/filter.php?c=Seafood`)
            if (!res.ok) {
                throw new Error("Failed to fetch")
            }
            const data = await res.json()
            const meals: RecipeCardable[] = await data.meals
            setSeafoodList(meals)
            console.log(meals)
        })()
    },[])
    
    return (
        <>
            <div className="ml-16 mt-12 p-4 bg-gray-600">
                <div className="flex flex-row flex-wrap justify-between">
                    { seafoodList.map(item => {
                        return <RecipeCard 
                                key={item.idMeal}
                                idMeal={item.idMeal}
                                strMeal={item.strMeal}
                                strMealThumb={item.strMealThumb}
                                />
                    })}

                </div>
            </div>
        </>
    )
}


// 0: {strMeal: 'Baked salmon with fennel & tomatoes', strMealThumb: 'https://www.themealdb.com/images/media/meals/1548772327.jpg', idMeal: '52959'}