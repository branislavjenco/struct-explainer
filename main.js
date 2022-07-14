const inputElement = document.querySelector("#format-input");
const submitElement = document.querySelector("#format-submit");
const formElement = document.querySelector("#format-form");
const explanationElement = document.querySelector("#explanation");

function main(url) {
  try {
    const formatString = decodeURIComponent(url.split("#")[1]);
    inputElement.value = formatString;
    const explanation = explainFormatString(formatString);
    const explanationToRender = renderExplanation(explanation);
    explanationElement.innerHTML = explanationToRender;
  } catch (e) {
    explanationElement.textContent = "Is that correct? " + e.message;
  }
}

window.addEventListener("hashchange", (event) => {
  if (event.newURL && event.target.newURL.includes("#")) {
    main(event.newURL);
  }
});

window.addEventListener("load", (event) => {
  if (event.target.URL && event.target.URL.includes("#")) {
    main(event.target.URL);
  }
});

formElement.addEventListener("submit", (event) => {
  event.preventDefault();
  const formatString = inputElement.value;
  window.location = "https://pythonstruct.com#" + formatString;
});
