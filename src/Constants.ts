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
 * Useful variables for interacting with CQ/AEM components.
 *
 * @namespace Constants
 */
export class Constants {

    /**
     * Name of the data-cq-data-path data attribute.
     */
    public static readonly DATA_PATH_ATTR = 'data-cq-data-path';

    /**
     * Class names associated with a new section component.
     */
    public static readonly NEW_SECTION_CLASS_NAMES = 'new section';

    /**
     * Type of the item.
     */
    public static readonly TYPE_PROP = PMConstants.TYPE_PROP;

    /**
     * List of child items of an item.
     */
    public static readonly ITEMS_PROP = PMConstants.ITEMS_PROP;

    /**
     * Order in which the items should be listed.
     */
    public static readonly ITEMS_ORDER_PROP = PMConstants.ITEMS_ORDER_PROP;

    /**
     * Path of the item.
     */
    public static readonly PATH_PROP = PMConstants.PATH_PROP;

    /**
     * Children of an item.
     */
    public static readonly CHILDREN_PROP = PMConstants.CHILDREN_PROP;

    /**
     * Hierarchical type of the item.
     */
    public static readonly HIERARCHY_TYPE_PROP = PMConstants.HIERARCHY_TYPE_PROP;

    private constructor() {
        // hide constructor
    }
}