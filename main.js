const inputElement = document.querySelector("#input");

inputElement.addEventListener('change', (event) => {
  const formatString = event.target.value; 
  const explanation = explainFormatString(formatString);
  const explanationToRender = renderExplanation(explanation);
  const explanationElement = document.querySelector('#explanation');
  explanationElement.textContent = `Explanation: ${explanationToRender}`;
});


