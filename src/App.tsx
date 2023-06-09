import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Navbar from "./components/Navbar"
import Sidebar from "./components/Sidebar"
import Home from "./pages/Home"
import Search from "./pages/Search"
import MyRecipes from "./pages/MyRecipes"
import Logout from "./components/Logout"
import Login from "./pages/Login"
import Register from "./pages/Register"
import RecipeView from "./pages/RecipeView"
import Personalize from "./pages/Personalize"
import UserRecipeView from "./pages/UserRecipeView"
import UserRecipeEdit from "./pages/UserRecipeEdit"
import DeleteRecipe from "./components/DeleteRecipe"
import UserSettings from "./pages/UserSettings"

function App() {

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Sidebar />
        <Routes>
          <Route path='/' element={ <Home /> } />
          <Route path='/search' element={ <Search /> } />
          <Route path='/recipe/:recIdParam' element={ <RecipeView /> } />
          <Route path='/personalize/:useRecIdParam' element={ <Personalize /> } />
          <Route path='/myrecipes' element={ <MyRecipes /> } />
          <Route path='/userRecipe/:recIdParam' element={ <UserRecipeView /> } />
          <Route path='/editRecipe/:useRecIdParam' element={ <UserRecipeEdit /> } />
          <Route path='/deleteRecipe/:deleteId' element={ <DeleteRecipe /> } />
          <Route path='/account' element={ <UserSettings /> } />
          <Route path='/register' element={ <Register /> } />
          <Route path='/login' element={ <Login /> } />
          <Route path='/logout' element={ <Logout /> } />
          <Route path='*' element={ <Navigate to='/' /> } />
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
