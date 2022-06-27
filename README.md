# AEM SPA React Editable Components 

[![License](https://img.shields.io/badge/license-Apache%202-blue)](https://github.com/adobe/aem-react-editable-components/blob/master/LICENSE)
[![NPM Version](https://img.shields.io/npm/v/@adobe/aem-react-editable-components.svg)](https://www.npmjs.com/package/@adobe/aem-react-editable-components)
[![Documentation](https://img.shields.io/badge/docs-api-blue)](https://opensource.adobe.com/aem-react-editable-components/)

[![codecov](https://codecov.io/gh/adobe/aem-react-editable-components/branch/master/graph/badge.svg)](https://codecov.io/gh/adobe/aem-react-editable-components)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=adobe_aem-react-editable-components&metric=alert_status)](https://sonarcloud.io/dashboard?id=adobe_aem-react-editable-components)
[![Known Vulnerabilities](https://snyk.io/test/github/adobe/aem-react-editable-components/badge.svg)](https://snyk.io/test/github/adobe/aem-react-editable-components)
[![Dependencies](https://badges.renovateapi.com/github/adobe/aem-react-editable-components)](https://app.renovatebot.com/dashboard#github/adobe/aem-react-editable-components)

This project provides the React components and integration layer to get you started with the Adobe Experience Manager SPA Editor.


## Installation
```
npm install @adobe/aem-react-editable-components
```

## Prerequisites

- [AEM SPA Model Manager](https://github.com/adobe/aem-spa-page-model-manager) is installed and initialized.
- App uses **React v16.8.0** or higher

## Documentation 

* [SPA Editor Overview](https://experienceleague.adobe.com/docs/experience-manager-64/developing/headless/spas/spa-overview.html?lang=en)
* [Getting Started with the AEM SPA Editor and Angular](https://docs.adobe.com/content/help/en/experience-manager-learn/spa-angular-tutorial/overview.html)
* [Getting Started with the AEM SPA Editor and React](https://docs.adobe.com/content/help/en/experience-manager-learn/spa-react-tutorial/overview.html)
* [Getting Started with the AEM SPA Editor and a remote React SPA](https://experienceleague.adobe.com/docs/experience-manager-learn/getting-started-with-aem-headless/spa-editor/remote-spa/overview.html?lang=en)

## Features

- [Components](./src/components)
- [Integration with AEM](./src/core)
- [Helpers](./src/api)


## Contributing

Contributions are welcome! Read the [Contributing Guide](CONTRIBUTING.md) for more information.

### Releasing

Merging the PR to master will trigger an automatic release Github Action. It is important to follow [Angular Commit Message Conventions](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines). Only **fix** and **feat** can trigger a release.

### Licensing

This project is licensed under the Apache V2 License. See [LICENSE](LICENSE) for more information.

