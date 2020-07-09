import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import XHR from 'i18next-xhr-backend';

const i18nPrep = i18next
  .use(XHR)
  .use(LanguageDetector)
  .init({
    fallbackLng: 'en',
    debug: true,
    backend: {
      loadPath: 'locales/{{lng}}.json',
      crossDomain: false
    }
  });

const debriefError = error => {
  if (error.Function) {
    const f = error.Function;
    if (f[1] === 'UnknownFunction') {
      return i18next.t('UnknownFunction', { name: `${f[0]}` });
    } else if ('NumberArgs' in f[1]) {
      return i18next.t(`NumberArgs${f[1].NumberArgs === 1 ? '' : '_plural'}`, { name: f[0], args: f[1].NumberArgs });
    }
  }
  if (error.ParseError) {
    const f = error.ParseError;
    if ('MissingArgument' === f) {
      return i18next.t('MissingArgument');
    } else if ('UnexpectedToken' in f) {
      return i18next.t('UnexpectedToken', { id: `${f.UnexpectedToken + 1}` });
    } else if ('MissingRParen' in f) {
      return f.MissingRParen == 1 
        ? i18next.t('MissingRParen')
        : i18next.t('MissingRParens', { id: `${f.MissingRParen}` });
    }
  }
  if (error.RPNError) {
    const f = error.RPNError;
    if (f === 'TooManyOperands') {
      return i18next.t('TooManyOperands');
    } else if ('MismatchedLParen' in f) {
      return i18next.t('MismatchedLParen', { id: `${f.MismatchedLParen + 1}` });
    } else if ('MismatchedRParen' in f) {
      return i18next.t('MismatchedRParen', { id: `${f.MismatchedRParen + 1}` });
    } else if ('UnexpectedComma' in f) {
      return i18next.t('UnexpectedComma', { id: `${f.UnexpectedComma + 1}` });
    } else if ('NotEnoughOperands' in f) {
      return i18next.t('NotEnoughOperands', { id: `${f.NotEnoughOperands + 1}` });
    }
  }
  if (error.EvalError) {
    const f = error.EvalError;
    if (f === 'FactorialError') {
      return i18next.t('FactorialError');
    }
  }
}

const js = import('./node_modules/@bopohob/timecalc/timecalc.js');
const input = document.getElementById('input');
const storageKey = 'expr';
const fineClass = 'fine';
const wrongClass = 'wrong';
const defaultExpression = '3:00:00 / 42.195';
let storedValue = localStorage.getItem(storageKey);
input.innerHTML = +storedValue == 0 ? defaultExpression : storedValue;
Promise.all([js, i18nPrep]).then(res => {
  document.getElementsByTagName('h1')[0].innerText = i18next.t('title');
  const kernel = res[0];
  const update = () => {
    const value = document.getElementById('input').innerHTML;
    localStorage.setItem(storageKey, value);
    const output = document.getElementById('output');
    try {
      output.innerHTML = kernel.eval_string(value);
      output.classList.add(fineClass);
      output.classList.remove(wrongClass);
    } catch(exception) {
      const empytStringMessage = i18next.t('EmptyStringMessage', { example: defaultExpression });
      const errorDebriefing = debriefError(exception.error) || exception.description;
      output.innerHTML = value.length === 0 ? empytStringMessage : errorDebriefing;
      output.classList.add(wrongClass);
      output.classList.remove(fineClass);
    }
  };
  update();
  input.addEventListener('keydown', update);
  input.addEventListener('keyup', update);
});
