# Components 


## Page ##

Render an AEM page and its content and enable authoring on AEM. All child components still need to be mapped to their AEM resourcetypes using **MapTo**.
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

Here,the Page component will render content on the AEM page at _us/en/home_ within the project _wknd-app_


## ResponsiveGrid

Render an AEM Layout Container and its content and enable authoring on AEM. 
Child components to be rendered within the container [should be mapped to their AEM resourcetypes using **MapTo**](https://experienceleague.adobe.com/docs/experience-manager-learn/getting-started-with-aem-headless/spa-editor/react/map-components.html?lang=en).

The OOTB ResponsiveGrid component maps to the resourceType _wcm/foundation/components/responsivegrid_ by default.

### Default SPA
For default SPA on AEM, the component can be used as-is OOTB.

### Remote SPA
When using the component directly within the app for remote SPA, two additional props _pagePath_ and _itemPath_ can be used to pass the path of the corresponding content on AEM.

```
<ResponsiveGrid 
  pagePath='/content/wknd-app/us/en/home'
  itemPath='root/responsivegrid' />
```

Here,the ResponsiveGrid component will render content of the layout container _/content/wknd-app/us/en/home/jcr:content/root/responsivegrid_ where _/content/wknd-app/us/en/home_ is the page on AEM and _root/responsivegrid_ the path to the item to be rendered within the page.

#### Virtual Container
The ResponsiveGrid component can still be used if content does not exist yet on AEM at the defined path. This will simply add an overlay on AEM for the author when opened for editing in AEM. More details are available [in the docs](https://experienceleague.adobe.com/docs/experience-manager-cloud-service/content/implementing/developing/hybrid/editing-external-spa.html?lang=en#virtual-containers).

#### Custom class for ResponsiveGrid

If a custom class name needs to be added to the OOTB ResponsiveGrid component, this can be done by passing in the class names as a string via the prop _customClassName_

```
<ResponsiveGrid 
  pagePath='/content/wknd-app/us/en/home'
  itemPath='root/responsivegrid'
  customClassName='newUserStyleClass' />
```

# Additional Features

### Remove AEM grid styling
AEM layouting styles are applied by default when using the ResponsiveGrid and Page components. If you would prefer to use your own custom layouting over the AEM authored layouts, an additional prop _removeAEMStyles_ (or maybe removeDefaultStyles) can be passed into the components.

```
<ResponsiveGrid 
  pagePath='/content/wknd-app/us/en/home'
  itemPath='root/responsivegrid'
  removeAEMStyles={true} />
```
This will remove all styles specific to the AEM grid system and corresponsing DOM wrappers.

