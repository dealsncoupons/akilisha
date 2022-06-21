import { useEffect, useState } from 'react';
import firebaseAuthService from '../service/firebase-auth';
import firebaseFirestoreService from '../service/firebase-database';
import AddEditRecipe from './AddEditRecipe';
import LoginForm from './LoginForm';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [currentRecipe, setCurrentRecipe] = useState(null); //holds recipe currently being edited, if any
  const [isLoading, setIsLoading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [orderBy, setOrderBy] = useState("desc");
  const [pageSize, setPageSize] = useState(3);

  useEffect(() => {
    setIsLoading(true);
    fetchRecipes()
      .then(fetchedRecipes => {
        setRecipes(fetchedRecipes);
      }).catch(error => {
        console.log(error.message);
        throw error;
      }).finally(() => {
        setIsLoading(false);
      })
  }, [user, categoryFilter, orderBy, pageSize])

  firebaseAuthService.subscribeToAuthChanges(setUser);

  async function handleAddRecipe(recipe) {
    try {
      console.log(`document to create - ${JSON.stringify(recipe)}`)
      const created = await firebaseFirestoreService.createDocument("recipes", recipe);
      alert(`successfully created with id - ${created.id}`);
      //fetch updated recipes
      handleFetchRecipes();
    } catch (error) {
      alert(error.message);
    }
  }

  async function fetchRecipes(pageCursor = '') {
    let filters = [];
    if (!user) {
      filters.push(['isPublished', "==", true])
    }
    if (categoryFilter) {
      filters.push(["category", "==", categoryFilter])
    }

    try {
      const response = await firebaseFirestoreService.queryDocuments("recipes", filters, [["publishDate", orderBy]], pageCursor, pageSize);
      const newRecipes = response.docs.map((doc) => {
        const id = doc.id;
        const data = doc.data();
        data.publishDate = new Date(data.publishDate.seconds * 1000);
        return { ...data, id };
      })

      if (pageCursor) {
        return [...recipes, ...newRecipes];
      }
      else {
        return [...newRecipes];
      }
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  async function handleFetchRecipes(pageCursor = '') {
    try {
      const fetchedRecipes = await fetchRecipes(pageCursor);
      setRecipes(fetchedRecipes);
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  function handlePageSizeChange(e) {
    const recipesPerPage = e.target.value;
    setRecipes([]);
    setPageSize(parseInt(recipesPerPage));
  }

  function handleLoadMoreRecipes() {
    const lastRecipe = recipes[recipes.length - 1];
    const pageCursor = lastRecipe.id;
    handleFetchRecipes(pageCursor);
  }

  async function handleUpdateRecipe(newRecipe, recipeId) {
    try {
      await firebaseFirestoreService.updateDocument("recipes", recipeId, newRecipe);
      handleFetchRecipes();
      alert(`successfully updated a recipe with id ${recipeId}`);
      setCurrentRecipe(null);
    } catch (error) {
      alert(error.message);
      throw error;
    }
  }

  async function handleDeleteRecipe(recipeId) {
    const deleteConfirmation = window.confirm("Are you sure you want to delete this recipe?");
    if (deleteConfirmation) {
      try {
        await firebaseFirestoreService.deleteDocument("recipes", recipeId);
        handleFetchRecipes();
        setCurrentRecipe(null);
        window.scrollTo(0, 0); //scroll to top of the page
        alert(`successfully deleted recipe with id ${recipeId}`);
      } catch (error) {
        alert(error.message);
        throw error;
      }
    }
  }

  function handleEditRecipe(recipeId) {
    const selectedRecipe = recipes.find(recipe => recipe.id === recipeId);
    if (selectedRecipe) {
      console.log(`selected recipe ${selectedRecipe.id} to edit`);
      setCurrentRecipe(selectedRecipe);
      window.scrollTo(0, document.body.scrollHeight); //scroll to bottom of the page
    }
  }

  function handleCancelEditRecipe() {
    setCurrentRecipe(null);
  }

  function lookupCategoryLabel(categoryKey) {
    const categories = {
      breadsSandwitchesAndPizza: "Breads, Sandwiches and Pizza",
      eggsAndBreakfast: "Eggs and Breakfast",
      dessertsAndBakedGoods: "Desserts and backed goods",
      fishAndSeafood: "Fish and Sea food",
      vegetables: "Vegetables",
    }
    return categories[categoryKey];
  }

  function formatDate(date) {
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1;
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
  }

  return (
    <div className="App">
      <div className='title-row'>
        <h2 className='title'>Firebase Marketplace</h2>
        <LoginForm user={user} />
      </div>
      <div className='main'>
        <div className='row filters'>
          <label className="recipe-label input-label">
            Category:
            <select
              required
              className="select"
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
            >
              <option value="">Filter by category</option>
              <option value="breadsSandwitchesAndPizza">Breads, Sandwiches and Pizza</option>
              <option value="eggsAndBreakfast">Eggs and Breakfast</option>
              <option value="dessertsAndBakedGoods">Desserts and backed goods</option>
              <option value="fishAndSeafood">Fish and Sea food</option>
              <option value="vegetables">Vegetables</option>
            </select>
          </label>
          <label className='input-label'>
            <select
              required
              className="select"
              value={orderBy}
              onChange={e => setOrderBy(e.target.value)}
            >
              <option value={"desc"}>Publish Date (newest - oldest)</option>
              <option value={"asc"}>Publish Date (oldest- newest)</option>
            </select>
          </label>
        </div>
        <div className='center'>
          <div className='recipe-list-box'>
            {
              isLoading ? (
                <div className='fire'>
                  <div className='flames'>
                    <div className='flame'></div>
                    <div className='flame'></div>
                    <div className='flame'></div>
                    <div className='flame'></div>
                  </div>
                  <div className='logs'></div>
                </div>
              ) : null
            }
            {
              !isLoading && recipes && recipes.length === 0 ? (
                <h5 className='no-recipes'>No Recipes Found</h5>
              ) : null
            }
            {
              !isLoading && recipes && recipes.length > 0 ? (
                <div className='recipe-list'>
                  {
                    recipes.map((recipe) => {
                      return (
                        <div className="recipe-card" key={recipe.id}>
                          {
                            recipe.isPublished === false ? (
                              <div className='unpublished'>
                                UNPUBLISHED
                              </div>
                            ) : null
                          }
                          <div className='recipe-name'>{recipe.name}</div>
                          <div className='recipe-image-box'>
                            {
                              recipe.imageUrl ? (
                                <img src={recipe.imageUrl} alt={recipe.name} className="recipe-image" />
                              ) : null
                            }
                          </div>
                          <div className='recipe-field'>Category: {lookupCategoryLabel(recipe.category)}</div>
                          <div className='recipe-field'>Publish Date: {formatDate(recipe.publishDate)}</div>
                          {
                            user ? (
                              <button type='button'
                                className='primary-button edit-button'
                                onClick={() => handleEditRecipe(recipe.id)}
                              >EDIT</button>
                            ) : null
                          }
                        </div>
                      )
                    })
                  }
                </div>
              ) : null
            }
          </div>
        </div>
        {
          isLoading || recipes && recipes.length > 0 ? (
            <>
              <label className='input-label'>
                Recipes per page:
                <select
                  className='select'
                  value={pageSize}
                  onChange={handlePageSizeChange}
                >
                  <option value={3}>3</option>
                  <option value={6}>6</option>
                  <option value={9}>9</option>
                </select>
              </label>
              <div className='pagination'>
                <button type='button' 
                className='primary-button'
                onClick={handleLoadMoreRecipes}>
                  Load More Recipes
                </button>
              </div>
            </>
          ) : null
        }
        {
          user ? <AddEditRecipe
            existingRecipe={currentRecipe}
            handleAddRecipe={handleAddRecipe}
            handleUpdateRecipe={handleUpdateRecipe}
            handleDeleteRecipe={handleDeleteRecipe}
            handleCancelEditRecipe={handleCancelEditRecipe} /> : null
        }
      </div>
    </div>
  );
}

export default App;
