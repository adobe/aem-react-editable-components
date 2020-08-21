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
import React, { Component } from 'react';
import { MapTo } from '@adobe/cq-react-editable-components';

class MyComponent extends Component{
    ...
}

export default MapTo('my/resource/type')(MyComponent);

```

You may also use Functional Components:

```
import React from 'react';
import { MapTo } from '@adobe/cq-react-editable-components';

class MyComponent {
    ...
const MyComponent = (props) => {
    return (<div> .... </div>);
}

export default MapTo('my/resource/type')(MyComponent);

```


TypeScript example with EditConfig (from version 1.3.0)

```
import React, { Component } from 'react';
import { MapTo, MappedComponentProperties } from '@adobe/cq-react-editable-components';

interface MyComponentProps extends MappedComponentProperties {
    myProperty?:string
}

class MyComponent extends Component<MyComponentProps> {
    ...
}

const MyComponentEditConfiguration:EditConfig<MyComponentProps> = {
    emptyLabel: 'My Component is Empty!',
    isEmpty: (props:MyComponentProps) => !!props.myProperty || props.myProperty.trim().length === 0
}

export default MapTo<MyComponentProps>('my/resource/type')(MyComponent, MyComponentEditConfiguration);

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

### Contributing !heading

Contributions are welcomed! Read the [Contributing Guide](CONTRIBUTING.md) for more information.

### Licensing !heading

This project is licensed under the Apache V2 License. See [LICENSE](LICENSE) for more information.
