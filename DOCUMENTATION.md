
### [@adobe/cq-react-editable-components](https://www.adobe.com/go/aem6_4_docs_spa_en) *0.0.24*



### src/ComponentMapping.js


    

    
#### ComponentMapping.map(resourceTypes, clazz[, editConfig, config])

Map a React component with the given resource types. If an {@link EditConfig} is provided the <i>clazz</i> is wrapped to provide edition capabilities on the AEM Page Editor




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| resourceTypes | `Array.<string>`  | - list of resource types for which to use the given <i>clazz</i> | &nbsp; |
| clazz | `class`  | - class to be instantiated for the given resource types | &nbsp; |
| editConfig | `EditConfig`  | - configuration object for enabling the edition capabilities | *Optional* |
| config | `[object Object]`  | - general configuration object | *Optional* |
| config.forceReload&#x3D;undefined | `boolean`  | - should the model cache be ignored when processing the component | *Optional* |




##### Returns


- `class`  - the resulting decorated Class


    


### src/components/Container.jsx


    
#### new Container(props)

Container component that provides the common features required by all containers such as the dynamic inclusion of child components.
<p>The Container supports content items as well as child pages</p>




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| props | `[object Object]`  | - the provided component properties | &nbsp; |
| props.cq_model | `[object Object]`  | - the page model configuration object | *Optional* |
| props.cq_model.:dataPath | `string`  | - relative path of the current configuration in the overall page model | *Optional* |




##### Returns


- `Void`


    

    
#### Container.modelProvider()

Wrapper class in which the content is eventually wrapped






##### Returns


- `ModelProvider`  


    

    
#### Container.getPagePath()

Returns the path of the page the current component is part of






##### Returns


-  


    

    
#### Container.getDynamicComponent(item)

Returns the {@link React.Component} mapped to the type of the item




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| item | `[object Object]`  | - item of the model | &nbsp; |




##### Returns


- `boolean`  


    

    
#### Container.getWrappedDynamicComponent(field, itemKey, containerDataPath, propertiesCallback)

Returns the component optionally wrapped into the current ModelProvider implementation




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| field | `string`  | - name of the field where the item is located | &nbsp; |
| itemKey | `string`  | - map key where the item is located in the field | &nbsp; |
| containerDataPath | `string`  | - relative path of the item's container | &nbsp; |
| propertiesCallback | `function`  | - properties to dynamically decorate the wrapper element with | &nbsp; |




##### Returns


- `React.Component`  


    

    
#### Container.getDynamicItemComponents(field, fieldOrder, containerDataPath)

Returns a list of item instances




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| field | `string`  | - name of the field where the item is located | &nbsp; |
| fieldOrder |  | - name of the field that contains the order in which the items are listed | &nbsp; |
| containerDataPath |  | - relative path of the item's container | &nbsp; |




##### Returns


- `Array.&lt;React.Component&gt;`  


    

    
#### Container.getDynamicPageComponents(field, containerDataPath)

Returns a list of page instances




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| field | `string`  | - name of the field where the item is located | &nbsp; |
| containerDataPath |  | - relative path of the item's container | &nbsp; |




##### Returns


- `Array.&lt;React.Component&gt;`  


    

    
#### Container.path()

Returns the path of the current resource






##### Returns


- `string`  


    

    
#### Container.innerContent()

Returns a list of child components






##### Returns


- `Array.&lt;React.Component&gt;`  


    


### src/components/ModelProvider.jsx


    
#### new ModelProvider(props)

Wrapper component responsible for synchronizing a child component with a given portion of the page model.
<p>The ModelProvider supports content items as well as child pages</p>




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| props | `[object Object]`  | - the provided component properties | &nbsp; |
| props.data_path | `string`  | - relative path of the current configuration in the overall page model | &nbsp; |
| props.page_path | `string`  | - absolute path of the containing page | &nbsp; |
| props.force_reload | `boolean`  | - should the cache be ignored | &nbsp; |




##### Returns


- `Void`


    

    
#### ModelProvider.updateData()

Updates the state and data of the current Object






##### Returns


- `Void`


    

    
#### ModelProvider.getPagePath()

Returns the provided page path property






##### Returns


- `string`  


    

    
#### ModelProvider.isPageModel()

Does the current component has the model of a page






##### Returns


- `boolean`  


    

    
#### ModelProvider.decorateChildElement(element)

Decorate a child {@link HTMLElement} with extra data attributes




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| element | `HTMLElement`  | - Element to be decorated | &nbsp; |




##### Returns


- `Void`


    

    
#### ModelProvider.decorateChildElements()

Decorate all the child {@link HTMLElement}s with extra data attributes






##### Returns


- `Void`


    

    
#### ModelProvider.getData()

Returns the model data from the page model






##### Returns


- `Promise`  


    


### src/components/ResponsiveColumnModelProvider.jsx


    
#### new ResponsiveColumnModelProvider()

Model provider specific to the components identified as responsive columns






##### Returns


- `Void`


    

    
#### ResponsiveColumnModelProvider.decorateChildElement()








##### Returns


- `Void`


    


### src/components/ResponsiveGrid.jsx


    

    
#### new ResponsiveGrid(props)

Container that provides the capabilities of the responsive grid




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| props | `[object Object]`  | - the provided component properties | &nbsp; |
| props.cq_model | `[object Object]`  | - the page model configuration object | *Optional* |
| props.cq_model.gridClassNames | `string`  | - the grid class names as provided by the content services | *Optional* |
| props.cq_model.classNames | `string`  | - the class names as provided by the content services | *Optional* |




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


    

    
#### PAGE_PATH_PROP()

Path of a page






##### Returns


- `Void`


    

    
#### PAGES_PROP()

List of child pages of an page






##### Returns


- `Void`


    

    
#### DATA_PATH_PROP()

Path of the resource in the model






##### Returns


- `Void`


    


### src/EditableComponentComposer.jsx


    

    
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


    
#### ModelProviderHelper(withModel)

Helper that facilitates the use of the {@link ModelProvider} component




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| withModel | `function`  |  | &nbsp; |




##### Returns


- `Void`


    

    
#### withModel(WrappedComponent[, config])

Returns a composite component where a {@link ModelProvider} component wraps the provided component




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| WrappedComponent | `React.Component`  | - component to be wrapped | &nbsp; |
| config | `[object Object]`  | - configuration object | *Optional* |
| config.forceReload&#x3D;undefined | `boolean`  | - should the model cache be ignored when processing the component | *Optional* |




##### Returns


- `CompositeModelProvider`  - the wrapped component


    


### src/Utils.js


    

    
#### Utils()

Helper functions for interacting with the AEM environment






##### Returns


- `Void`


    

    
#### isInEditor()

Is the app used in the context of the AEM Page editor






##### Returns


- `boolean`  


    

