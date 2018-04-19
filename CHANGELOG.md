### v0.0.24 - 17 April 2018

Initial public release of cq-react-editable-components. Including:
* `@adobe/cq-spa-component-mapping#0.0.10` 
* `@adobe/cq-spa-page-model-manager#0.0.21`.
* Updated Base React Components with support for multiple pages:
  * `Container` supports page and items inclusion
  * `ModelProvider` generates `data-cq-page-path` and `data-cq-data-path` attributes (previously: `data-cq-content-path`) respectively from the `cq_model_data_path` and `cq_model_page_path` properties (previously: `cq_model_path`)