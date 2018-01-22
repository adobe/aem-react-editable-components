/*
 *  Copyright 2017 Adobe Systems Incorporated. All rights reserved.
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
require('./dist/edit/EditableComponentComposer');

/**
 * Contains all the base components
 * @namespace components
 */

/**
 * Contains all the edit classes
 * @namespace edit
 */

module.exports = {
    component: {
        Container: require('./dist/components/Container').default
    },
    edit: {
        AbstractEdit: require('./dist/edit/AbstractEdit').default,
        ImageEdit: require('./dist/edit/ImageEdit').default,
        TextEdit: require('./dist/edit/TextEdit').default
    },
    ComponentMapping: require('./dist/ComponentMapping').ComponentMapping,
    MapTo: require('./dist/ComponentMapping').MapTo,
    ModelProvider: require('./dist/ModelProvider').default,
    Utils: require('./dist/ModelProvider').default
};
