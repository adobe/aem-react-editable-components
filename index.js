/*
 *  Copyright 2018 Adobe Systems Incorporated. All rights reserved.
 *  This file is licensed to you under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License. You may obtain a copy
 *  of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software distributed under
 *  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 *  OF ANY KIND, either express or implied. See the License for the specific language
 *  governing permissions and limitations under the License.
 *
 */

require('./dist/components/ResponsiveColumnModelProvider');
require('./dist/components/ResponsiveGrid');
require('./dist/EditableComponentComposer');

/**
 * Contains all the base components
 * @namespace components
 */

module.exports = {
    ComponentMapping: require('./dist/ComponentMapping').ComponentMapping,
    Container: require('./dist/components/Container').default,
    MapTo: require('./dist/ComponentMapping').MapTo,
    withModel: require('./dist/ModelProviderHelper').default.withModel,
    ModelProvider: require('./dist/components/ModelProvider').default,
    PageModelManager: require('@adobe/cq-spa-page-model-manager').default,
    Constants: require('./dist/Constants').default,
    Utils: require('./dist/Utils').default
};
