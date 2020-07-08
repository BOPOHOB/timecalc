const errorDebriefing = error => {

}

const js = import("./node_modules/@bopohob/timecalc/timecalc.js");
const input = document.getElementById("input");
const storageKey = "expr";
const fineClass = "fine";
const wrongClass = "wrong";
const defaultExpression = "3:00:00 / 42.195";
js.then(js => {
  const update = () => {
    const value = document.getElementById("input").value;
    localStorage.setItem(storageKey, value);
    const output = document.getElementById("output");
    try {
      output.innerHTML = js.eval_string(value);
      output.classList.add(fineClass);
      output.classList.remove(wrongClass);
    } catch(exception) {
      const empytStringMessage = `Enter the expression. <nobr>"${defaultExpression}"</nobr> for example`;
      output.innerHTML = value.length == 0 ? empytStringMessage : errorDebriefing(exception.error) || exception.description;
      output.classList.add(wrongClass);
      output.classList.remove(fineClass);
    }
  };
  update();
  input.addEventListener("keydown", update);
  input.addEventListener("keyup", update);
});
let storedValue = localStorage.getItem(storageKey);
input.value = +storedValue == 0 ? defaultExpression : storedValue;
