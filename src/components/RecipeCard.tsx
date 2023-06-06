import { RecipeCardable } from "../pages/Home";


export default function RecipeCard(props: RecipeCardable) {
  return (
    <div key={props.idMeal}
        className="w-48 bg-gray-800 rounded-md m-4 p-4
        cursor-pointer
        hover: shadow-lg">
        <div className="aspect-video relative">
            <img src={props.strMealThumb} alt={props.strMeal} 
                className="object-cover rounded-md"/>
        </div>
        
        <p className="text-white pt-4">{props.strMeal}</p>
    </div>
  )
}
