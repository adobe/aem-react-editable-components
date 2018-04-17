# [@adobe/cq-react-editable-components](https://www.adobe.com/go/aem6_4_docs_spa_en) *0.0.22*



### src/ComponentMapping.js


#### wrappedMapFct()  *private method*

Wrapped function






##### Returns


- `Void`



#### ComponentMapping.map(resourceTypes, clazz, editConfig) 

Map a React component with the given resource types. If an {@link EditConfig} is provided the <i>clazz</i> is wrapped to provide edition capabilities on the AEM Page Editor




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| resourceTypes | `Array.<string>`  | list of resource types for which to use the given <i>clazz</i> | &nbsp; |
| clazz | `class`  | class to be instantiated for the given resource types | &nbsp; |
| editConfig | `EditConfig`  | configuration object for enabling the edition capabilities | &nbsp; |




##### Returns


- `class`  the resulting decorated Class




### src/components/Container.jsx


#### new Container() 

Container component that provides the common features required by all containers such as the dynamic inclusion of child components






##### Returns


- `Void`



#### Container.modelProvider() 

Wrapper class in which the content is eventually wrapped






##### Returns


- `ModelProvider`  



#### Container.path() 

Returns the path of the current resource






##### Returns


- `string` `boolean`  




### src/components/ModelProvider.jsx


#### new ModelProvider() 

Wrapper component responsible for synchronizing a child component with a give portion of the page model






##### Returns


- `Void`



#### ModelProvider.updateData() 

Updates the state and data of the current Object






##### Returns


- `Void`



#### ModelProvider.decorateChildElement(element) 

Decorate a child {@link HTMLElement} with extra data attributes




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| element | `HTMLElement`  | Element to be decorated | &nbsp; |




##### Returns


- `Void`



#### ModelProvider.decorateChildElements() 

Decorate all the child {@link HTMLElement}s with extra data attributes






##### Returns


- `Void`



#### ModelProvider.getData(path) 

Gets the model data from the page model




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| path | `String`  | Location of the data in the page model | &nbsp; |




##### Returns


- `Promise`  




### src/components/ResponsiveColumnModelProvider.jsx


#### new ResponsiveColumnModelProvider() 

Model provider specific to the components considered as responsive columns






##### Returns


- `Void`



#### ResponsiveColumnModelProvider.decorateChildElement() 








##### Returns


- `Void`




### src/components/ResponsiveGrid.jsx


#### new Placeholder()  *private method*

Placeholder of the responsive grid component






##### Returns


- `Void`



#### new ResponsiveGrid() 

Container that provides the capabilities of the responsive grid






##### Returns


- `Void`



#### ResponsiveGrid.gridClassNames() 

Returns the class names of the grid element






##### Returns


- `string` `boolean`  



#### ResponsiveGrid.classNames() 

Provides the class names of the grid wrapper






##### Returns


- `string`  



#### ResponsiveGrid.placeholder() 

Returns the content of the responsive grid placeholder






##### Returns


- `[object Object]`  



#### ResponsiveGrid.modelProvider() 








##### Returns


- `ResponsiveColumnModelProvider`  




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




### src/EditableComponentComposer.jsx


#### EditableComponentComposer()  *private method*

Helper class for composing producing a component that can be authored

Higher-Order Component pattern






##### Returns


- `Void`



#### compose(WrappedComponent, editConfig) 

Decorate the given component with properties carried by the editConfig object




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| WrappedComponent | `Component`  | {@link React.Component} to be rendered | &nbsp; |
| editConfig | `EditConfig`  | Configuration object responsible for carrying the authoring capabilities to decorate the wrapped component | &nbsp; |




##### Returns


- `CompositePlaceholder`  the wrapping component




### src/ModelProviderHelper.jsx


#### ModelProviderHelper() 

Helper that facilitate the use of the {@link ModelProvider} component






##### Returns


- `Void`



#### withModel(WrappedComponent) 

Returns a composite component where a {@link ModelProvider} component wraps the provided component




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| WrappedComponent |  |  | &nbsp; |




##### Returns


- `CompositeModelProvider`  




### src/Utils.js


#### IN_EDITOR_SELECTOR()  *private method*

Selector that identifies the page is being authored by the page editor






##### Returns


- `Void`



#### Utils() 

Helper functions for interacting with the AEM environment






##### Returns


- `Void`



#### isInEditor() 

Is the app used in the context of the AEM Page editor






##### Returns


- `boolean`  




*Documentation generated with [doxdox](https://github.com/neogeek/doxdox).*
