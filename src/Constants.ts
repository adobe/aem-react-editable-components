/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { Constants as PMConstants } from '@adobe/aem-spa-page-model-manager';

/**
 * Constants for interacting with AEM components.
 */
export class Constants {

    /**
     * Name of the data-cq-data-path data attribute.
     */
    public static readonly DATA_PATH_ATTR = 'data-cq-data-path';

    /**
     * Name of the data-resource-type data attribute.
     */
    public static readonly DATA_CQ_RESOURCE_TYPE_ATTR = 'data-cq-resource-type';

    /**
     * Class names associated with a new section component.
     */
    public static readonly NEW_SECTION_CLASS_NAMES = 'new section';
    /**
     * Class name used to denote aem-container root element.
     */
    public static readonly _CONTAINER_CLASS_NAMES = 'aem-container';
    /**
     * Class name used to identify the placeholder used to represent an empty component.
     */
    public static readonly _PLACEHOLDER_CLASS_NAMES = 'cq-placeholder'
    public static readonly _PAGE_CLASS_NAMES = 'aem-page';
    public static readonly _RESPONSIVE_GRID_PLACEHOLDER_CLASS_NAMES = 'aem-Grid-newComponent';

    /**
     * Event which indicates that content of remote component has been fetched and loaded in the app
     */
    public static readonly REMOTE_CONTENT_LOADED = 'cq-remotecontent-loaded';

    /**
     * Selector for WCM mode state meta property.
     */
    public static readonly _WCM_MODE_META_SELECTOR = 'meta[property="cq:wcmmode"]';

    public static readonly TYPE_PROP = PMConstants.TYPE_PROP;
    public static readonly ITEMS_PROP = PMConstants.ITEMS_PROP;
    public static readonly ITEMS_ORDER_PROP = PMConstants.ITEMS_ORDER_PROP;
    public static readonly PATH_PROP = PMConstants.PATH_PROP;
    public static readonly CHILDREN_PROP = PMConstants.CHILDREN_PROP;
    public static readonly HIERARCHY_TYPE_PROP = PMConstants.HIERARCHY_TYPE_PROP;
    public static readonly JCR_CONTENT = PMConstants.JCR_CONTENT;

    private constructor() {
        // hide constructor
    }
}
