const inputElement = document.querySelector("#format-input");
const submitElement = document.querySelector("#format-submit");
const formElement = document.querySelector("#format-form");
const explanationElement = document.querySelector('#explanation');
const example1Element = document.querySelector("#example1");

example1Element.addEventListener('click', (event) => {
  inputElement.value = event.target.text;
  formElement.submit();
})

formElement.addEventListener('submit', (event) => {
  console.log(event)
  const formatString = event.target.value; 
  try {
    const explanation = explainFormatString(formatString);
    const explanationToRender = renderExplanation(explanation);
    explanationElement.innerHTML = explanationToRender;
  } catch(e) {
    console.log(e);
    explanationElement.textContent = e;
  }
});


