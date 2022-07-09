const inputElement = document.querySelector("#format-input");
const submitElement = document.querySelector("#format-submit");
const formElement = document.querySelector("#format-form");
const explanationElement = document.querySelector("#explanation");

window.addEventListener("hashchange", (event) => {
  try {
    const formatString = decodeURIComponent(event.newURL.split("#")[1]);
    inputElement.value = formatString;
    const explanation = explainFormatString(formatString);
    const explanationToRender = renderExplanation(explanation);
    explanationElement.innerHTML = explanationToRender;
  } catch (e) {
    explanationElement.textContent = "Is that correct? " + e.message;
  }
});

formElement.addEventListener("submit", (event) => {
  event.preventDefault();
  const formatString = inputElement.value;
  window.location = "https://pythonstruct.com#" + formatString;
});
