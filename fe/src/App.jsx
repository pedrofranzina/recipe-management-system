import { Route, Switch } from "wouter";
import Header from "./components/Header"
import Footer from "./components/Footer"
import HomePage from "./views/HomePage"
import Recipes from "./views/Recipes"
import RecipeDetail from "./views/RecipeDetail"
import AboutMePage from "./views/AboutMe"
import SearchPage from "./views/SearchPage"
import CreateRecipeForm from "./components/CreateRecipeForm"
import LoginForm from "./components/LoginForm"
import Register from "./views/Register"
import FavoritesPage from './views/FavoritesPage'
import ProtectedRoute from './components/ProtectedRoute'
import EditRecipeForm from './components/EditRecipeForm'

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFF8DC]">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/about" component={AboutMePage} />
          <Route path="/recipes" component={Recipes} />
          <Route path="/recipe/:id" component={RecipeDetail} />
          <Route path="/search" component={SearchPage} />
          <Route path="/login" component={LoginForm} />
          <Route path="/register" component={Register} />
          <Route path="/create-recipe">
            <ProtectedRoute>
              <CreateRecipeForm />
            </ProtectedRoute>
          </Route>
          <Route path="/favorites" component={FavoritesPage} />
          <Route path="/edit-recipe/:id">
            <ProtectedRoute>
              <EditRecipeForm />
            </ProtectedRoute>
          </Route>
        </Switch>
      </main>
      <Footer />
    </div>
  )
}

export default App