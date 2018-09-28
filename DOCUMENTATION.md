
### [@adobe/cq-react-editable-components](https://www.adobe.com/go/aem6_4_docs_spa_en) *1.0.2*



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


    

    
#### new Container()

Container component.

Provides access to items.






##### Returns


- `Void`


    

    
#### Container.childComponents()

Returns the child components of this Container.
It will iterate over all the items and instantiate the child components if a Mapping is found
Instantiation is done my connecting the Component with the data of that item






##### Returns


- `Array.&lt;Object&gt;`  An array with the components instantiated to JSX


    

    
#### Container.connectComponentWithItem(ChildComponent, itemProps, itemKey)

Connects a child component with the item data




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| ChildComponent | `Component`  | the child component | &nbsp; |
| itemProps | `Object`  | - the item data | &nbsp; |
| itemKey | `String`  | - the name of the item in map | &nbsp; |




##### Returns


- `Object`  - the React element constructed by connecting the values of the input with the Component


    

    
#### Container.getItemComponentProps(item, itemKey, itemPath)

Returns the properties to add on a specific child component




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| item | `Object`  | The item data | &nbsp; |
| itemKey | `String`  | The key of the item | &nbsp; |
| itemPath | `String`  | The path of the item | &nbsp; |




##### Returns


- `Object`  The map of properties to be added


    

    
#### Container.getItemPath(itemKey)

Computes the path of the current item




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| itemKey | `String`  | - the key of the item | &nbsp; |




##### Returns


- `String`  - the computed path


    

    
#### Container.containerProps()

The properties that will be injected in the root element of the container






##### Returns


- `Object`  - The map of properties to be added


    

    
#### Container.placeholderProps()

The properties that will go on the placeholder component root element






##### Returns


- `Object`  - The map of properties to be added


    

    
#### Container.placeholderComponent()

The placeholder component that will be added in editing






##### Returns


- `Object`  React element to be instantiated as a placeholder


    


### src/components/EditableComponent.js


    

    
#### new EditableComponent()

The EditableComponent extends components with editing capabilities






##### Returns


- `Void`


    

    
#### EditableComponent.editProps()

Properties related to the edition of the component






##### Returns


- `Void`


    

    
#### EditableComponent.emptyPlaceholderProps()

HTMLElement representing the empty placeholder






##### Returns


-  


    

    
#### EditableComponent.useEmptyPlaceholder()

Should an empty placeholder be added






##### Returns


- `boolean`  


    

    
#### withEditable(WrappedComponent[, editConfig])

Returns a composition that provides edition capabilities to the component




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| WrappedComponent | `React.Component`  |  | &nbsp; |
| editConfig | `EditConfig`  |  | *Optional* |




##### Returns


- `Void`


    


### src/components/ModelProvider.js


    
#### new ModelProvider()

Wraps a portion of the page model into a Component.

Fetches content from AEM (using ModelManager) and inject it into the passed React Component.






##### Returns


- `Void`


    


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


    

    
#### DATA_PATH_ATTR()

Name of the data-cq-data-path data attribute






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


    

    

