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

import { Constants as PMConstants } from '@adobe/cq-spa-page-model-manager';

/**
 * Useful variables for interacting with CQ/AEM components.
 *
 * @namespace Constants
 */
class Constants {

    /**
     * Name of the data-cq-data-path data attribute.
     */
    public static DATA_PATH_ATTR = 'data-cq-data-path';

    /**
     * Class names associated with a new section component.
     */
    public static NEW_SECTION_CLASS_NAMES = 'new section';

    /**
     * Type of the item.
     */
    public static TYPE_PROP = PMConstants.TYPE_PROP;

    /**
     * List of child items of an item.
     */
    public static ITEMS_PROP = PMConstants.ITEMS_PROP;

    /**
     * Order in which the items should be listed.
     */
    public static ITEMS_ORDER_PROP = PMConstants.ITEMS_ORDER_PROP;

    /**
     * Path of the item.
     */
    public static PATH_PROP = PMConstants.PATH_PROP;

    /**
     * Children of an item.
     */
    public static CHILDREN_PROP = PMConstants.CHILDREN_PROP;

    /**
     * Hierarchical type of the item.
     */
    public static HIERARCHY_TYPE_PROP = PMConstants.HIERARCHY_TYPE_PROP;

    private constructor() {
        // hide constructor
    }
}

export default Constants;
