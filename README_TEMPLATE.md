## Installation !heading
```
npm install @adobe/cq-react-editable-components
```

## Usage !heading

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
 

## API !heading

#include "DOCUMENTATION.md"

## Documentation !heading 

The [technical documentation](https://www.adobe.com/go/aem6_4_docs_spa_en) is already available, but if you are unable to solve your problem or you found a bug you can always [contact us](https://www.adobe.com/go/aem6_4_support_en) and ask for help!

## Changelog !heading 

#include "CHANGELOG.md"
