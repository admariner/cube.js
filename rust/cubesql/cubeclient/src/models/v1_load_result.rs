/*
 * Cube.js
 *
 * Cube.js Swagger Schema
 *
 * The version of the OpenAPI document: 1.0.0
 *
 * Generated by: https://openapi-generator.tech
 */

use crate::models;
use serde::{Deserialize, Serialize};

#[derive(Clone, Default, Debug, PartialEq, Serialize, Deserialize)]
pub struct V1LoadResult {
    #[serde(rename = "dataSource", skip_serializing_if = "Option::is_none")]
    pub data_source: Option<String>,
    #[serde(rename = "annotation")]
    pub annotation: Box<models::V1LoadResultAnnotation>,
    #[serde(rename = "data")]
    pub data: Vec<serde_json::Value>,
    #[serde(rename = "refreshKeyValues", skip_serializing_if = "Option::is_none")]
    pub refresh_key_values: Option<Vec<serde_json::Value>>,
}

impl V1LoadResult {
    pub fn new(
        annotation: models::V1LoadResultAnnotation,
        data: Vec<serde_json::Value>,
    ) -> V1LoadResult {
        V1LoadResult {
            data_source: None,
            annotation: Box::new(annotation),
            data,
            refresh_key_values: None,
        }
    }
}
