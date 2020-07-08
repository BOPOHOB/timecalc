mod utils;

extern crate serde;
use serde::{Serialize, Deserialize};

use wasm_bindgen::prelude::*;
use meval::*;
use std::str::FromStr;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

fn eval_expression(expression: &String) -> Result<(f64, f64), Error> {
    let expr = Expr::from_str(expression.as_ref())?;
    expr.eval_with_unit()
}

fn truncate(mut s: String) -> String {
    while s.ends_with('0') {
        s.pop();
    }
    if s.ends_with('.') {
        s.pop();
    }
    s
}

#[derive(Serialize, Deserialize)]
struct ErrorDescriptor {
    description: String,
    error: Error,
}

fn convert_error_to_jsvalue(err: Error) -> JsValue {
    JsValue::from_serde(&ErrorDescriptor{
        description: format!("{}", err),
        error: err,
    }).unwrap()
}

#[wasm_bindgen(catch)]
pub fn eval_string(expression: String) -> std::result::Result<String, JsValue> {
    match eval_expression(&expression) {
        Ok((result, degre)) => {
            let mut s = (result * 1000f64).round() / 1000f64;
            Ok(
                if degre == 1. {
                    if result == f64::INFINITY {
                        "eternity".into()
                    } else if result == -f64::INFINITY {
                        "negative eternity".into()
                    } else {
                        let sign = if s > 0f64 { "" } else { "-" };
                        s = s.abs();
                        let h = (s / 3600f64).floor() as i64;
                        s -= (h * 3600) as f64;
                        let m = (s / 60f64).floor() as i64;
                        s -= (m * 60) as f64;
                        truncate(
                            if h > 0 {
                                format!("{}{}:{:02}:{:07.4}", sign, h, m, s)
                            } else if m > 0 {
                                format!("{}{}:{:07.4}", sign, m, s)
                            } else {
                                format!("{}{:.4}", sign, s)
                            }
                        )
                    }
                } else if result == f64::INFINITY {
                    "infinity".into()
                } else if result == -f64::INFINITY {
                    "negative infinity".into()
                } else {
                    format!("{}", s)
                }
            )
        },
        Err(e) => Err(convert_error_to_jsvalue(e)),
    }
}
