import * as model from './model';
import 'core-js/stable';
import { modalCloseTime } from './config';
import 'regenerator-runtime/runtime';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import paginationView from './views/paginationView';
import resultsView from './views/resultsView';
import bookmarkView from './views/bookmarkView';
import addRecipeView from './views/addRecipeView';

const controlRecipe = async function () {
	try {
		const id = window.location.hash.slice(1);
		if (!id) return;
		recipeView.renderSpinner();
		// Update results view to mark selected search resutls
		resultsView.update(model.getSearchResultsPage());
		// Updating bookmarks view
		bookmarkView.update(model.state.bookmarks);
		// Loading data from API
		await model.loadRecipe(id);
		// Rendering recipe
		recipeView.render(model.state.recipe);
	} catch (err) {
		recipeView.renderError();
	}
};

const controlSearchResutls = async function () {
	try {
		// 1. সার্চ কোয়েরীকে ধরা
		resultsView.renderSpinner();
		const query = searchView.getQuery();
		if (!query) return;

		// 2. সার্চ রেজাল্টকে রেন্ডার করা
		await model.loadSearchResults(query);

		// 3. Render results
		resultsView.render(model.getSearchResultsPage());

		// 4. Render initial pagination button
		paginationView.render(model.state.search);
		console.log(model.state.search);
	} catch (err) {
		console.log(err);
	}
};

const controlPagination = function (goToPage) {
	// 3. Render new results
	resultsView.render(model.getSearchResultsPage(goToPage));

	// 4. Render new pagination button
	paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
	// Update the recipe servings (in state)
	model.updateServings(newServings);

	// Update the recipe view
	recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
	// Add/remove bookmark
	if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
	else model.deleteBookmark(model.state.recipe.id);

	// Update recipe view
	recipeView.update(model.state.recipe);

	// Render bookmarks
	bookmarkView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
	bookmarkView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
	try {
		// Show loading spinner
		addRecipeView.renderSpinner();

		// Upload new recipe data
		await model.uploadRecipe(newRecipe);
		console.log(model.state.recipe);

		// Render recipe
		recipeView.render(model.state.recipe);

		// Success recipe
		addRecipeView.renderMessage();

		// Render bookmark view
		bookmarkView.render(model.state.bookmarks);

		// Change ID in URL
		window.history.pushState(null, '', `#${model.state.recipe.id}`);

		// Close form window
		setTimeout(function () {
			addRecipeView.toggleWindow();
		}, modalCloseTime * 1000);
	} catch (err) {
		console.error('❌', err);
		addRecipeView.renderError(err.message);
	}
};

(function () {
	recipeView.addHandlerRender(controlRecipe);
	searchView.addHandlerSearch(controlSearchResutls);
	paginationView.addHandlerClick(controlPagination);
	recipeView.addHandlerUpdateServings(controlServings);
	recipeView.addHandlerAddBookmark(controlAddBookmark);
	bookmarkView.addHandlerRender(controlBookmarks);
	addRecipeView.addHandlerUpload(controlAddRecipe);
})();
