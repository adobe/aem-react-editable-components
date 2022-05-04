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

```
const TextEditConfig = {    
  emptyLabel:  'Text',
  isEmpty: () => {},
  resourceType: "wknd-app/components/text"
};
```
where _emptyLabel_ is the label to be displayed for empty overlay in AEM, _isEmpty_ the method to check if no content is present and empty overlay is needed, and _resourceType_ the resourcetype of the component on AEM.

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


3. Use this component - 
  - By passing in the appropriate props if using it as a standalone component within your SPA 

  ```
  <AEMText 
    pagePath='/content/wknd-app/us/en/home'
    itemPath='root/responsivegrid/text />
  ```
  
  **OR** 

  - [Map to the appropriate resource type](https://experienceleague.adobe.com/docs/experience-manager-learn/getting-started-with-aem-headless/spa-editor/react/map-components.html?lang=en) if using as part of a container

  ```
  MapTo('wknd-app/components/text')(AEMText);
  ```


