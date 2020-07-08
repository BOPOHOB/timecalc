const debriefError = error => {
  if (error.Function) {
    const f = error.Function;
    if (f[1] === 'UnknownFunction') {
      return [`${f[0]} function is unknown`];
    } else if ('NumberArgs' in f[1]) {
      return [`${f[0]} require ${f[1].NumberArgs} argument${f[1].NumberArgs === 1 ? '' : 's'}`];
    }
  }
  if (error.ParseError) {
    const f = error.ParseError;
    if ('MissingArgument' === f) {
      return ['Missing argument at the end of expression'];
    } else if ('UnexpectedToken' in f) {
      return [`Unexpected token in position ${f.UnexpectedToken}`, f.UnexpectedToken];
    } else if ('MissingRParen' in f) {
      return [f.MissingRParen == 1 ? 'Missing right parenthesis' : `Missing ${f.MissingRParen} right parentheses`];
    }
  }
  if (error.RPNError) {
    const f = error.RPNError;
    if (f === 'TooManyOperands') {
      return ['Too many operands left at the end of expression'];
    } else if ('MismatchedLParen' in f) {
      return [`Mismatched left parenthesis at token ${f.MismatchedLParen}`, f.MismatchedLParen];
    } else if ('MismatchedRParen' in f) {
      return [`Mismatched right parenthesis at token ${f.MismatchedLParen}`, f.MismatchedRParen];
    } else if ('UnexpectedComma' in f) {
      return [`Unexpected comma at token ${f.UnexpectedComma}`, f.UnexpectedComma];
    } else if ('NotEnoughOperands' in f) {
      return [`Missing operands at token ${f.NotEnoughOperands}`, f.NotEnoughOperands];
    }
  }
  if (error.EvalError) {
    const f = error.EvalError;
    if (f.FactorialError) {
      return ['Numeric fail while factorial computation'];
    }
  }
}

const js = import('./node_modules/@bopohob/timecalc/timecalc.js');
const input = document.getElementById('input');
const storageKey = 'expr';
const fineClass = 'fine';
const wrongClass = 'wrong';
const defaultExpression = '3:00:00 / 42.195';
const openSpan = '<span style="color: red;">';
const closeSpan = '</span>';
js.then(js => {
  const update = () => {
    const value = document.getElementById('input').innerHTML.replace(openSpan, '').replace(closeSpan, '');
    localStorage.setItem(storageKey, value);
    const output = document.getElementById('output');
    try {
      output.innerHTML = js.eval_string(value);
      output.classList.add(fineClass);
      output.classList.remove(wrongClass);
    } catch(exception) {
      const empytStringMessage = `Enter the expression. <nobr>"${defaultExpression}"</nobr> for example`;
      const errorDebriefing = debriefError(exception.error) || [exception.description];
      console.log(errorDebriefing.length);
      output.innerHTML = value.length === 0 ? empytStringMessage : errorDebriefing[0];
      output.classList.add(wrongClass);
      output.classList.remove(fineClass);
    }
  };
  update();
  input.addEventListener('keydown', update);
  input.addEventListener('keyup', update);
  input.addEventListener('change', console.log);
});
let storedValue = localStorage.getItem(storageKey);
input.innerHTML = +storedValue == 0 ? defaultExpression : storedValue;
