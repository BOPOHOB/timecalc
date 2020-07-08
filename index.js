const js = import("./node_modules/timecalc/timecalc.js");
js.then(js => {
  const input = document.getElementById("input");
  const update = () => {
    let result = "";
    try {
      result = js.eval_string(document.getElementById("input").value);
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
