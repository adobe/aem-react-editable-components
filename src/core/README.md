# Integration with AEM

## EditableComponent

Wrapper component to enable AEM authoring and content fetch for a React component.

### Sample

Existing simple React component: 

```
const Text = (props) => <div>{props.text}</div>
```

To make this editable on AEM and fetch content to be rendered on AEM : 

1. Create a config object as illustrated [in the wknd sample](https://github.com/adobe/aem-guides-wknd-spa/blob/React/latest/ui.frontend/src/components/Text/Text.js#L29).

```json
export const TextEditConfig = {    
  emptyLabel: "Text" 
  // Label to be displayed for empty overlay in AEM,
  isEmpty: TextV2IsEmptyFn,
  // Method to check if no values are present and empty overlay is needed
  resourceType: "wknd-app/components/text"
  // Resourcetype of the component on AEM
};
```
_resourceType_ in config is essential for supporting [virtual component](https://experienceleague.adobe.com/docs/experience-manager-cloud-service/content/implementing/developing/hybrid/editing-external-spa.html?lang=en#virtual-leaf-components) usecases.

2. Create an editable version of the component using the _EditableComponent_ wrapper and passing in the config.

```
export const AEMText = (props) => (
    <EditableComponent 
      config={TextEditConfig} 
      {...props}>
        <Text />
    </EditableComponent>
);
```

3. Use this component by passing in the appropriate props if using it as a standalone component within your SPA - 

```
<AEMText 
  pagePath='/content/wknd-app/us/en/home'
  itemPath='root/responsivegrid/text />
```

or [map to the appropriate resource type](https://experienceleague.adobe.com/docs/experience-manager-learn/getting-started-with-aem-headless/spa-editor/react/map-components.html?lang=en) if using as part of a container.

```
MapTo('wknd-app/components/text')(AEMText);
```


