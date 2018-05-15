### 0.0.29 - 15 May 2018

Public release of `cq-spa-page-model-manager`, which provides:

 * Support for the latest version of the `com.adobe.cq.export.json.hierarchy` API
    * Support and usage of the `:path` and `:children` fields to identify a page and its child pages

### 0.0.28 - 20 April 2018

Initial public release of cq-react-editable-components. Including:
* `@adobe/cq-spa-component-mapping#0.0.15` 
* `@adobe/cq-spa-page-model-manager#0.0.22`.
* Updated Base React Components with support for multiple pages:
  * `Container` supports page and items inclusion
  * `ModelProvider` generates `data-cq-page-path` and `data-cq-data-path` attributes (previously: `data-cq-content-path`) respectively from the `cq_model_data_path` and `cq_model_page_path` properties (previously: `cq_model_path`)