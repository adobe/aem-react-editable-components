# Table of contents

  * [Installation](#installation)
  * [Usage](#usage)
  * [Documentation](#documentation)
    * [Contributing](#contributing)
    * [Licensing](#licensing)


## Installation
```
npm install @adobe/aem-react-editable-components
```

## Usage

This module provides generic React helpers and components supporting AEM authoring.    

It also wraps and the following modules (React agnostic):
* `@adobe/aem-spa-component-mapping` 
* `@adobe/aem-spa-page-model-manager`

### React Components

The following components can be used to build React SPA aimed at being authored in AEM:

* `ModelProvider`, which wraps a portion of the page model into a component 
* `Container`, which offers dynamic inclusion of its children components
* `ResponsiveGrid`, the default container grid component (already mapped to `wcm/foundation/components/responsivegrid`)

### Map To 

The `MapTo` helper can be used to directly associate resource type(s) with a given SPA component.

```
import { MapTo } from '@adobe/aem-react-editable-components';

class MyComponent {
    ...
}

export default MapTo('my/resource/type')(MyComponent);

```

### Page Model Manager

The `PageModelManager` API allows to manage the model representation of the AEM pages that are composing a SPA.

The `ModelProvider` internally uses it to fetch content from AEM and inject it into a given React component. It also keeps the React component in sync when the content in AEM changes.
 

## Documentation

* [Technical documentation](https://www.adobe.com/go/aem6_5_docs_spa_en).
* [Tutorial to get started](https://docs.adobe.com/content/help/en/experience-manager-learn/spa-react-tutorial/overview.html)



### Contributing

Contributions are welcome! Read the [Contributing Guide](CONTRIBUTING.md) for more information.

### Licensing

This project is licensed under the Apache V2 License. See [LICENSE](LICENSE) for more information.
