import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import ImagePreview from "./ImagePreview";

function AddEditItemForm({ existingRecipe, handleAddRecipe, handleUpdateRecipe, handleDeleteRecipe, handleCancelEditRecipe }) {

	useEffect(() => {
		if(existingRecipe){
			setName(existingRecipe.name);
			setCategory(existingRecipe.category);
			setDirections(existingRecipe.directions);
			setPublishDate(existingRecipe.publishDate.toISOString().split("T")[0]);
			setIngredients(existingRecipe.ingredients);
			setImageUrl(existingRecipe.imageUrl);
		}
		else{
			resetForm();
		}
	}, [existingRecipe]);

	const [name, setName] = useState("");
	const [category, setCategory] = useState("");
	const [publishDate, setPublishDate] = useState(new Date().toISOString().split("T")[0]);
	const [directions, setDirections] = useState("");
	const [ingredients, setIngredients] = useState([]);
	const [ingredientName, setIngredientName] = useState("");
	const [imageUrl, setImageUrl] = useState("");

	function handleRecipeFormSubmit(e){
		e.preventDefault();
		if(ingredients.length === 0){
			alert("ingredients cannot be empty");
			return;
		}

		if(!imageUrl){
			alert("Missing recipe image. Please add recipe image");
			return;
		}

		const isPublished = new Date(publishDate) <= new Date();

		const newRecipe = {
			name,
			category,
			directions,
			publishDate: new Date(publishDate),
			isPublished,
			ingredients,
			imageUrl,
		};

		if(existingRecipe){
			handleUpdateRecipe(newRecipe, existingRecipe.id);
		}
		else{
			handleAddRecipe(newRecipe);
		}

		resetForm();
	}

	function handleAddIngredient(e){
		if(e.key && e.key !== "Enter"){
			return;
		}
		e.preventDefault();
		if(!ingredientName){
			alert("Missing ingredient");
			return;
		}

		setIngredients([...ingredients, ingredientName]);
		setIngredientName("");
	}

	function resetForm(){
		setName("");
		setCategory("");
		setDirections("");
		setPublishDate("");
		setIngredients([]);
		setImageUrl("");
	}

	return (
		<form className="add-edit-recipe-form-container" onSubmit={handleRecipeFormSubmit}>
			{
				existingRecipe? (
					<h2>Update a recipe</h2>
				) : (
					<h2>Add a new recipe</h2>
				)
			}
			<div className="top-form-section">
				<div className="image-input-box">
                    Recipe Image 
					<ImagePreview 
						basePath="recipes"
						existingImageUrl={imageUrl}
						handleUploadFinish={(downloadUrl) => setImageUrl(downloadUrl)}
						handleUploadCancel={() => setImageUrl("")}
					/>
				</div>
				<div className="fields">
					<label className="recipe-label input-label">
                        Recipe Name:
						<input
							type="text"
							required
							className="input-text"
							value={name}
							onChange={e => setName(e.target.value)}
						/>
					</label>
					<label className="recipe-label input-label">
                        Category:
						<select
							required
							className="select"
							value={category}
							onChange={e => setCategory(e.target.value)}
						>
							<option value="">Select a category</option>
							<option value="breadsSandwitchesAndPizza">Breads, Sandwiches and Pizza</option>
							<option value="eggsAndBreakfast">Eggs and Breakfast</option>
							<option value="dessertsAndBakedGoods">Desserts and backed goods</option>
							<option value="fishAndSeafood">Fish and Sea food</option>
							<option value="vegetables">Vegetables</option>
						</select>
					</label>
					<label className="recipe-label input-label">
                        Directions:
						<textarea
							required
							cols={30}
							rows={6}
							className="input-text directions"
							value={directions}
							onChange={e => setDirections(e.target.value)}
						></textarea>
					</label>
					<label className="recipe-label input-label">
                        Publish Date:
						<input
							type="date"
							required
							className="input-text"
							value={publishDate}
							onChange={e => setPublishDate(e.target.value)}
						/>
					</label>
				</div>
			</div>
			<div className="ingredients-list">
				<h3 className="text-center">Ingredients</h3>
				<table className="ingredients-table">
					<thead>
						<tr>
							<th className="table-header">Ingredient</th>
							<th className="table-header">Delete</th>
						</tr>
					</thead>
					<tbody>
						{
							ingredients && ingredients.length > 0? ingredients.map(ingredient => {
								return (
									<tr key={ingredient}>
										<td className="table-data text-center">{ingredient}</td>
										<td className="ingredient-delete-box">
											<button type="button" className="secondary-button ingredient-delete-button">Delete</button>
										</td>
									</tr>
								);
							}) : null
						}
					</tbody>
				</table>
				{ingredients && ingredients.length === 0? 
					<h3 className="text-center no-ingredients">No ingredients added yet</h3>
					: null
				}
				<div className="ingredient-form">
					<label className="ingredient-label">
                        Ingredient:
						<input
							type="text"
							className="input-text"
							value={ingredientName}
							placeholder="ex. 1 cup of sugar"
							onChange={e => setIngredientName(e.target.value)}
							onKeyUp={handleAddIngredient}
						/>
					</label>
					<button type="button" className="primary-button add-ingredient-button" onClick={handleAddIngredient}>Add Ingredient</button>
				</div>
			</div>
			<div className="action-buttons">
				<button type="submit" className="primary-button action-button">
					{
						existingRecipe? "Update Recipe" : "Create Recipe"
					}
				</button>
				{
					existingRecipe? (
						<>
							<button type="button" className="primary-button action-button" onClick={handleCancelEditRecipe}>Cancel Edit</button>
							<button type="button" className="primary-button action-button" onClick={() => handleDeleteRecipe(existingRecipe.id)}>Delete Recipe</button>
						</>
					) : null
				}
			</div>
		</form>
	);
}

AddEditItemForm.propTypes = {
	existingRecipe: PropTypes.shape({
		id: PropTypes.string,
		name: PropTypes.string,
		directions: PropTypes.string,
		category: PropTypes.string,
		direction: PropTypes.string,
		publishDate: PropTypes.string,
		ingredients: PropTypes.array,
		imageUrl: PropTypes.string,
	}),
	handleAddRecipe: PropTypes.func,
	handleUpdateRecipe: PropTypes.func,
	handleDeleteRecipe: PropTypes.func,
	handleCancelEditRecipe: PropTypes.func
};

export default AddEditItemForm;