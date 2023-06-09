import { Link } from "react-router-dom";
import { RecipeCardable } from "../pages/Home";

export default function RecipeCard(props: RecipeCardable) {
  return (
    <div className="m-2">
      <Link to={`/${props.linkTo}/${props.idMeal}`} >
        <div key={props.idMeal}
            className="w-48 bg-gray-800 rounded-md p-4
            cursor-pointer drop-shadow-lg hover:drop-shadow-xl
            sm:w-auto"
            >
            <div className="aspect-video relative">
                <img src={props.strMealThumb} alt={props.strMeal} 
                    className="object-cover rounded-md"/>
            </div>
            
            <p className="text-white pt-4">{props.strMeal}</p>
        </div>
      </Link>
    </div>
  )
}
