import { useState } from "react"
import { RecipeCardable } from "./Home"
import { RiSearchLine } from "react-icons/ri"
import { useForm, SubmitHandler } from "react-hook-form"
import RecipeCard from "../components/RecipeCard"
import { RecipeContent } from "./Personalize"
import Spinner from "../components/Spinner"

const base_meals_api_url = import.meta.env.VITE_BASE_MEAL_API_URL

export default function Search() {

    const [ arrRecipes, setArrRecipes ] = useState<RecipeCardable[]>([])
    const { register, handleSubmit } = useForm()

    async function handleSearch(data: any): Promise<SubmitHandler<RecipeContent>> {
        const res = await fetch(`${base_meals_api_url}/search.php?s=${data.keyword}`)
        if (!res.ok) {
            throw new Error("Failed to fetch")
        }
        const apiData = await res.json()
        const arrData: RecipeCardable[] = await apiData.meals
        console.log(arrData)
        setArrRecipes(arrData)
        return apiData
    }

    return (
        <>
            <div className="ml-16 mt-12 p-4 bg-gray-600">
                <h2 className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
                    Search&nbsp;
                    <span className="text-transparent bg-clip-text bg-gradient-to-r to-sky-200 from-sky-400">
                    Recipes
                    </span>
                </h2>
                <div>
                    <form onSubmit={handleSubmit(handleSearch)} className="flex flex-row">
                        <input {...register('keyword')} 
                        type="text" placeholder="i.e. Eggs" className="mr-3 mb-3 py-2 px-3 rounded-md text-lg text-gray-900 bg-gray-50 border border-gray-300 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-sky-500 dark:focus:border-sky-500" />
                        <button>
                            <RiSearchLine type="submit" size="45" className="p-1 mb-3 bg-sky-600 text-sky-100 rounded-3xl after:hover:text-sky-600 hover:bg-gray-600 transition-all duration-200 ease-linear cursor-pointer" />
                        </button>
                    </form>
                </div>
                <div className="flex flex-row flex-wrap justify-between items-start">
                {   
                    arrRecipes.map((item, index) => 
                        <RecipeCard 
                            key={`recipeCard${index}`}
                            idMeal={item.idMeal}
                            strMeal={item.strMeal}
                            strMealThumb={item.strMealThumb}
                            linkTo={`recipe`}
                        />
                    )
                }
                </div>
            </div>
        </>
    )
}
