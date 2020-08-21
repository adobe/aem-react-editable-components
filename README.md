# Table of contents

  * [Installation](#installation)
  * [Usage](#usage)
  * [API](#api)
  * [Documentation](#documentation)
  * [Changelog](#changelog)
    * [Contributing](#contributing)
    * [Licensing](#licensing)


## Installation
```
npm install @adobe/cq-react-editable-components
```

## Usage

This module provides generic React helpers and components supporting AEM authoring.    

It also wraps and the following modules (React agnostic):
* `@adobe/cq-spa-component-mapping` 
* `@adobe/cq-spa-page-model-manager`

### React Components

The following components can be used to build React SPA aimed at being authored in AEM:

* `ModelProvider`, which wraps a portion of the page model into a component 
* `Container`, which offers dynamic inclusion of its children components
* `ResponsiveGrid`, the default container grid component (already mapped to `wcm/foundation/components/responsivegrid`)

### Map To 

The `MapTo` helper can be used to directly associate resource type(s) with a given SPA component.

```
import { MapTo } from '@adobe/cq-react-editable-components';

class MyComponent {
    ...
}

export default MapTo('my/resource/type')(MyComponent);

```

### Page Model Manager

The `PageModelManager` API allows to manage the model representation of the AEM pages that are composing a SPA.

The `ModelProvider` internally uses it to fetch content from AEM and inject it into a given React component. It also keeps the React component in sync when the content in AEM changes.
 

## API


### [@adobe/cq-react-editable-components](https://www.adobe.com/go/aem6_4_docs_spa_en) *1.3.1*



### src/Constants.ts


    
#### new Constants()

Useful variables for interacting with CQ/AEM components.






##### Returns


- `Void`


    


### src/Utils.ts


    

    
#### isBrowser()

Returns if we are in the browser context or not by checking for the
existance of the window object.






##### Returns


- `Boolean`  the result of the check of the existance of the window object


    

    

    
#### Utils()

Helper functions for interacting with the AEM environment.






##### Returns


- `Void`


    

    
#### isInEditor()

Is the app used in the context of the AEM Page editor.






##### Returns


- `boolean`  


    

    


### src/HierarchyConstants.ts


    
#### new HierarchyType()

Hierarchical types






##### Returns


- `Void`


    



## Documentation 

The [technical documentation](https://www.adobe.com/go/aem6_4_docs_spa_en) is already available, but if you are unable to solve your problem or you found a bug you can always [contact us](https://www.adobe.com/go/aem6_4_support_en) and ask for help!

## Changelog 

### 1.3.1 - 20 August 2020
* Fix of types

### 1.3.0 - 20 August 2020
* Update codebase to TypeScript

### 1.2.1 - 5 June 2020
* Update to latest `cq-spa-page-model-manager`

### 1.2.0 - 19 December 2019

* Make `react-fast-compare` a dependency instead of a peer dependency
* Remove optional dependencies

### 1.1.0 - 5 April 2019

* **NEW FEATURE** Template Editor
  * Give access to the list of Allowed Components from the ResponsiveGrid component

### 1.0.4 - 13 December 2018

* Support for latest `cq-spa-page-model-manager` and `cq-spa-component-mapping` API

### 1.0.3 - 28 September 2018

* **BREAKING CHANGE** Refactoring of the Container, ResponsiveGrid and Placeholders to improve extensibility
* **BREAKING CHANGE** Relocation of the columnClassNames field from the ResponsiveColumn to the ResponsiveGrid to respect the latest model representation, the field type changed
* Support for latest `cq-spa-page-model-manager` API
* **BREAKING CHANGE** 'dragDropName' support removed for EditConfig in ComponentMapping


### 0.0.30 - 20 June 2018

* **BREAKING CHANGE** `props` that are passed to Components renamed:
  * `cq_model` => `cqModel`
  * `cq_model_page_path` => `cqModelPagePath`
  * `cq_model_data_path` => `cqModelDataPath`
* Responsive grid placeholder not displayed when entering the editor via the preview model
* Change routing method to support History API by default (hash routing support has been removed)

* **BREAKING CHANGE** ModelProvider `props` renamed:
  * `data_path` => `dataPath`
  * `page_path` => `pagePath`
  * `force_reload` => `forceReload`

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


### Contributing

Contributions are welcomed! Read the [Contributing Guide](CONTRIBUTING.md) for more information.

### Licensing

This project is licensed under the Apache V2 License. See [LICENSE](LICENSE) for more information.
