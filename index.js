const errorDebriefing = error => {
  if (error.Function) {
    const f = error.Function;
    if (f[1] === "UnknownFunction") {
      return `${f[0]} function is unknown`;
    } else if ("NumberArgs" in f[1]) {
      return `${f[0]} require ${f[1].NumberArgs} argument${f[1].NumberArgs === 1 ? '' : 's'}`;
    }
  }
  if (error.ParseError) {
    const f = error.ParseError;
    if ("MissingArgument" === f) {
      return "Missing argument at the end of expression";
    } else if ("UnexpectedToken" in f) {
      return `Unexpected token in position ${f.UnexpectedToken}`;
    } else if ("MissingRParen" in f) {
      return f.MissingRParen == 1 ? "Missing right parenthesis" : `Missing ${f.MissingRParen} right parentheses`;
    }
  }
  if (error.RPNError) {
    const f = error.RPNError;
    if (f.MismatchedLParen) {
      return `Mismatched left parenthesis at token ${f.MismatchedLParen}`;
    }
    if (f.MismatchedRParen) {
      return `Mismatched right parenthesis at token ${f.MismatchedRParen}`;
    }
    if (f.UnexpectedComma) {
      return `Unexpected comma at token ${f.UnexpectedComma}`;
    }
    if (f.NotEnoughOperands) {
      return `Missing operands at token ${f.NotEnoughOperands}`;
    }
    if (f.TooManyOperands) {
      return "Too many operands left at the end of expression";
    }
  }
  if (error.EvalError) {
    const f = error.EvalError;
    if (f.FactorialError) {
      return "Numeric fail while factorial computation";
    }
  }
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
      output.innerHTML = value.length === 0 ? empytStringMessage : errorDebriefing(exception.error) || exception.description;
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
