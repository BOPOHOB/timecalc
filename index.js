const js = import("./node_modules/@bopohob/timecalc/timecalc.js");
const input = document.getElementById("input");
const storageKey = "expr";
js.then(js => {
  const update = () => {
    let result = "";
    const value = document.getElementById("input").value;
    localStorage.setItem(storageKey, value);
    try {
      result = js.eval_string(value);
    } catch(exception) {
      console.log(exception.error);
      result = exception.description;
    }
    document.getElementById("output").innerHTML = result;
  };
  update();
  input.addEventListener("keydown", update);
  input.addEventListener("keyup", update);
});
input.value = localStorage.getItem(storageKey) || "45:00 / 1:52 * 3.921";
