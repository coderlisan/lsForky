import view from './view';
import previewView from './previewView';

class ResultsView extends view {
	_parentElement = document.querySelector('.results');
	_errorMessage = 'No recipe is found. Please try again.';
	_message = '';

	_generateMarkup() {
		return this._data.map(result => previewView.render(result, false)).join('');
	}
}
export default new ResultsView();
