# Components 


## Page ##

Render an AEM page and its content and enable authoring on AEM. All child components still need to be mapped to their AEM resourcetypes using **MapTo** or [the **components** prop](#component-mapping).
All mapped components also need to be updated to use the newly introduced wrapper [EditableComponent](../core/README.md).

### Default SPA

For default SPA on AEM, the component can be used as-is OOTB.

#### Migration to v2

- *ComponentMappingContent* is now handled internally, so the [usage as illustrated in the sample WKND project](https://github.com/adobe/aem-guides-wknd-spa/blob/React/latest/ui.frontend/src/components/Page/Page.js) as - 

```
export default MapTo('wknd-spa-react/components/page')(
  withComponentMappingContext(withRoute(AppPage))
);
```

can be simplified and now instead be -
```
export default MapTo('wknd-spa-react/components/page')(
  withRoute(AppPage)
);
```

- *Model fetching* is now handled internally, so [the usage of withModel](https://github.com/adobe/aem-guides-wknd-spa/blob/React/latest/ui.frontend/src/App.js#L16)  - 

```
export default withModel(App);
```

can be removed and can be used simply as -

```
export default App;
```

### Remote SPA
When using the component directly within the app for remote SPA, an additional prop _pagePath_ can be used to pass the path of the corresponding page on AEM.

```
<Page 
  pagePath='/content/wknd-app/us/en/home' />
```

Here, the Page component will render content on the AEM page at _us/en/home_ within the project _wknd-app_


## ResponsiveGrid

Render an AEM Layout Container and its content and enable authoring on AEM. 
Child components to be rendered within the container [should be mapped to their AEM resourcetypes using **MapTo**](https://experienceleague.adobe.com/docs/experience-manager-learn/getting-started-with-aem-headless/spa-editor/react/map-components.html?lang=en).

The OOTB ResponsiveGrid component maps to the resourceType _wcm/foundation/components/responsivegrid_ by default.

### Default SPA
For default SPA on AEM, the component can be used as-is OOTB.

### Remote SPA
When using the component directly within the app for remote SPA, two additional props _pagePath_ and _itemPath_ can be used to pass the path of the corresponding content on AEM.

```jsx
<ResponsiveGrid 
  pagePath='/content/wknd-app/us/en/home'
  itemPath='root/responsivegrid' />
```

Here,the ResponsiveGrid component will render content of the layout container _/content/wknd-app/us/en/home/jcr:content/root/responsivegrid_ where _/content/wknd-app/us/en/home_ is the page on AEM and _root/responsivegrid_ the path to the item to be rendered within the page.

#### Virtual Container
The ResponsiveGrid component can still be used if content does not exist yet on AEM at the defined path. This will simply add an overlay on AEM for the author when opened for editing in AEM. More details are available [in the docs](https://experienceleague.adobe.com/docs/experience-manager-cloud-service/content/implementing/developing/hybrid/editing-external-spa.html?lang=en#virtual-containers).

#### Custom class for ResponsiveGrid

If a custom class name needs to be added to the OOTB ResponsiveGrid component, this can be done by passing in the class names as a string via the prop _customClassName_

```jsx
<ResponsiveGrid 
  pagePath='/content/wknd-app/us/en/home'
  itemPath='root/responsivegrid'
  customClassName='newUserStyleClass' />
```


## Container

For all container components other than ResponsiveGrid, you can either use the Container component as-is or use the helper method _getChildComponents()_ and then render them according to the markup requirements.

### Default SPA
Lets say you want to use the WCM Core Container component, and based on user's selection it can either be a _ResponsiveGrid_ or a normal _Container_. 

Here is a sample snippet of how it can be acheived.

```jsx
const MyContainerEditConfig = {
  emptyLabel: 'Container',
  isEmpty: function(props){
    return !props.cqItemsOrder || !props.cqItemsOrder.length ===0
  }
}

const MyContainer = (props) => 
{
  const MyComponent = (props.layout!=="SIMPLE")?ResponsiveGrid:Container;
  return <MyComponent {...props} />;
}

MapTo('/wknd/components/content/container')(MyContainer, MyContainerEditConfig);
```

Now lets say you want to render a custom markup for your container, example - a component like Tabs which is also a container, then the sample snippet above can be refactored.

```jsx
const MyTabsEditConfig = {
  emptyLabel: 'Tabs',
  isEmpty: function(props){
    return !props.cqItemsOrder || !props.cqItemsOrder.length ===0
  }
}

const MyTabs = (props) => 
{
  const tabItemsInOrder = Container.getChildComponents(props);

  const tabItemsJsx = tabItemsInOrder.map((tabItemJsx) =><div className="tab-item">{tabItemJsx}</div>);

  return <div className="tabs">${tabItemsJsx}</div>;
}

MapTo('/wknd/components/content/tabs')(MyTabs, MyTabsEditConfig);
```

#### Migration to v2

Before SPA 2.0, Container component is a class based component an it required the consumers to instantiate the class or use class based inheritance to ontain the child components e.g. this.childComponents in your custom implementation loaded all the child components as an array. Now this needs to be replaced with the helper method as shown in sample snippet above.

### Remote SPA

```jsx
<Container 
  pagePath='/content/wknd-app/us/en/home'
  itemPath='root/responsivegrid/container' />
```

For a custom container, you shall be able to adopt same guidelines followed for normal SPA.

# Additional Features

### Prefetched Model

If the model for rendering the component has already been fetched (for eg: in SSR), this can be passed into the component via a prop, so that the component doesn't need to fetch it again on the client side.

```jsx
const App = ({ model }) => (
  <ResponsiveGrid 
    pagePath='/content/wknd-app/us/en/home'
    itemPath='root/responsivegrid'
    model={model} />
);
```

### Remove AEM grid styling
AEM layouting styles are applied by default when using the ResponsiveGrid and Page components. If you would prefer to use your own custom layouting over the AEM authored layouts, an additional prop _removeDefaultStyles_ can be passed into the components.

```jsx
<ResponsiveGrid 
  pagePath='/content/wknd-app/us/en/home'
  itemPath='root/responsivegrid'
  removeDefaultStyles={true} />
```
This will remove all styles specific to the AEM grid system and corresponsing DOM wrappers.

### Component Mapping

Mapping child components to a container component can now be done via a prop instead of having to do _MapTo_ on initial load.

If the container components has 2 child components, _Text_ and _Image_ of resource type _wknd/text_ and _wknd/image_ respectively, these can now be mapped to a grid component as below - 

```jsx
<ResponsiveGrid 
  pagePath='/content/wknd-app/us/en/home'
  itemPath='root/responsivegrid'
  components={{
    "wknd/text": Text,
    "wknd/image": Image
  }} />
```

Mapping of the resource type to the corresponding component will then be handled internally by the SPA SDK.

### Lazy Loading

Child components can be lazy loaded to ensure that they are dynamically imported only when needed, thus reducing the amount of code on initial load.

#### Prerequisites

- The container component with the child components to be lazy loaded [should be within a _Suspense_ component with fallback content](https://reactjs.org/docs/code-splitting.html#reactlazy).
- The component to be lazy loaded should be a default export.

#### Using with RemotePage component

To ensure the lazy loaded chunks are imported from the appropriate origin and not the AEM instance when the app is rendered for authoring in the AEM editor, [update the SPA to explicitly set the public path](https://webpack.js.org/guides/public-path/#on-the-fly) to the host URL of the SPA.

#### MapTo

```
import Text from ./components/Text';
MapTo('wknd/text')(Text);
```

can be updated to lazy load the Text component on usage as below - 

```
MapTo('wknd/text')(React.lazy(() => import('./components/Text')));
```

#### _components_ Prop

```jsx
<ResponsiveGrid 
  ...
  components={{
    "wknd/text": Text
  }} />
```
can be updated to lazy load the child components on usage as below - 

```jsx
<ResponsiveGrid 
  ...
  components={{
    "wknd/text": React.lazy(() => import('./components/Text'))
  }} />
```