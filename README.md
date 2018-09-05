# Table of contents

  * [Installation](#installation)
  * [Usage](#usage)
  * [API](#api)
  * [Documentation](#documentation)
  * [Changelog](#changelog)


## Installation
```
npm install @adobe/cq-react-editable-components@beta
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


### [@adobe/cq-react-editable-components](https://www.adobe.com/go/aem6_4_docs_spa_en) *0.0.31-beta.7*



### src/ComponentMapping.js


    

    
#### ComponentMapping.map(resourceTypes, component[, editConfig, config])

Map a React component with the given resource types. If an {@link EditConfig} is provided the <i>clazz</i> is wrapped to provide edition capabilities on the AEM Page Editor




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| resourceTypes | `Array.<string>`  | - list of resource types for which to use the given <i>clazz</i> | &nbsp; |
| component | `React.Component`  | - class to be instantiated for the given resource types | &nbsp; |
| editConfig | `EditConfig`  | - configuration object for enabling the edition capabilities | *Optional* |
| config | `[object Object]`  | - general configuration object | *Optional* |
| config.forceReload&#x3D;undefined | `boolean`  | - should the model cache be ignored when processing the component | *Optional* |




##### Returns


- `React.Component`  - the resulting decorated Class


    


### src/components/Container.js


    

    
#### ContainerPlaceholder.childComponents()

Returns the child components of this Container.
It will iterate over all the items and instantiate the child components if a Mapping is found
Instantiation is done my connecting the Component with the data of that item






##### Returns


- `Array.&lt;Object&gt;`  An array with the components instantiated to JSX


    

    
#### ContainerPlaceholder.connectComponentWithItem(ChildComponent, itemProps, itemKey)

Connects a child component with the item data




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| ChildComponent | `Component`  | the child component | &nbsp; |
| itemProps | `Object`  | - the item data | &nbsp; |
| itemKey | `String`  | - the name of the item in map | &nbsp; |




##### Returns


- `Object`  - the React element constructed by connecting the values of the input with the Component


    

    
#### ContainerPlaceholder.getItemComponentProps(item, itemKey, itemPath)

Returns the properties to add on a specific child component




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| item | `Object`  | The item data | &nbsp; |
| itemKey | `String`  | The key of the item | &nbsp; |
| itemPath | `String`  | The path of the item | &nbsp; |




##### Returns


- `Object`  The map of properties to be added


    

    
#### ContainerPlaceholder.getItemPath(itemKey)

Computes the path of the current item




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| itemKey | `String`  | - the key of the item | &nbsp; |




##### Returns


- `String`  - the computed path


    

    
#### ContainerPlaceholder.containerProps()

The properties that will be injected in the root element of the container






##### Returns


- `Object`  - The map of properties to be added


    

    
#### ContainerPlaceholder.placeholderProps()

The properties that will go on the placeholder component root element






##### Returns


- `Object`  - The map of properties to be added


    

    
#### ContainerPlaceholder.placeholderComponent()

The placeholder component that will be added in editing






##### Returns


- `Object`  React element to be instantiated as a placeholder


    


### src/components/Page.js


    
#### new Page()

The container for a Page.
In editing we need to force that this doesn't render a placeholder

It should add data-cq-page-path instead fo data-cq-data-path






##### Returns


- `Void`


    

    
#### Page.containerProps()

The attributes that will be injected in the root element of the container






##### Returns


- `Object`  - the attributes of the container


    

    
#### Page.childPages()

Returns the child pages of a page






##### Returns


- `Array`  


    

    
#### Page.getItemPath(itemKey)

Computes the path of the current item




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| itemKey | `String`  | - the key of the item | &nbsp; |




##### Returns


- `String`  - the computed path


    


### src/components/ResponsiveGrid.js


    
#### containerProps()

The attributes that will be injected in the root element of the container






##### Returns


- `Object`  - the attributes of the container


    

    
#### placeholderProps()

The properties that will go on the placeholder component root element






##### Returns


- `Object`  - the properties as a map


    

    
#### getItemComponentProps(item, itemKey, itemPath)

Returns the properties to add on a specific child component




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| item | `Object`  | The item data | &nbsp; |
| itemKey | `String`  | The key of the item | &nbsp; |
| itemPath | `String`  | The path of the item | &nbsp; |




##### Returns


- `Object`  The map of properties to be added


    


### src/Constants.js


    
#### Constants()

Useful variables for interacting with CQ/AEM components






##### Returns


- `Void`


    

    
#### NEW_SECTION_CLASS_NAMES()

Class names associated with a new section component






##### Returns


- `Void`


    

    
#### TYPE_PROP()

Type of the item






##### Returns


- `Void`


    

    
#### ITEMS_PROP()

List of child items of an item






##### Returns


- `Void`


    

    
#### ITEMS_ORDER_PROP()

Order in which the items should be listed






##### Returns


- `Void`


    

    
#### PATH_PROP()

Path of the item






##### Returns


- `Void`


    

    
#### CHILDREN_PROP()

Children of an item






##### Returns


- `Void`


    

    
#### HIERARCHY_TYPE_PROP()

Hierarchical type of the item






##### Returns


- `Void`


    


### src/HierarchyConstants.js


    
#### HierarchyConstants()

Hierarchical types






##### Returns


- `Void`


    

    
#### hierarchyType()

Type of hierarchy






##### Returns


- `Void`


    

    
#### page()

Hierarchical page type






##### Returns


- `Void`


    


### src/InternalUtils.js


    
#### InternalUtils()

Internal Helper functions for interacting with the AEM environment






##### Returns


- `Void`


    

    


### src/Utils.js


    

    
#### EDIT_MODE()

The editor is in one of the edition modes






##### Returns


- `Void`


    

    
#### PREVIEW_MODE()

The editor is in preview mode






##### Returns


- `Void`


    

    
#### isBrowser()

Returns if we are in the browser context or not by checking for the 
existance of the window object






##### Returns


- `Boolean`  the result of the check of the existance of the window object


    

    

    
#### Utils()

Helper functions for interacting with the AEM environment






##### Returns


- `Void`


    

    
#### isInEditor()

Is the app used in the context of the AEM Page editor






##### Returns


- `boolean`  


    


### src/withEditConfig.js


    

    
#### withEditConfig(WrappedComponent, editConfig)

Wrapped the HTMLNodeElement of the given component with properties carried by the editConfig object.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| WrappedComponent | `React.Component`  | {@link React.Component} to be rendered | &nbsp; |
| editConfig | `EditConfig`  | Configuration object responsible for carrying the authoring capabilities to decorate the wrapped component | &nbsp; |




##### Returns


- `CompositePlaceholder`  the wrapping component


    



## Documentation 

The [technical documentation](https://www.adobe.com/go/aem6_4_docs_spa_en) is already available, but if you are unable to solve your problem or you found a bug you can always [contact us](https://www.adobe.com/go/aem6_4_support_en) and ask for help!

## Changelog 

# LATEST

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
