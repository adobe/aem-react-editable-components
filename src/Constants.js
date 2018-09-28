/*
 * ADOBE CONFIDENTIAL
 *
 * Copyright 2018 Adobe Systems Incorporated
 * All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Adobe Systems Incorporated and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Adobe Systems Incorporated and its
 * suppliers and may be covered by U.S. and Foreign Patents,
 * patents in process, and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe Systems Incorporated.
 */
import {Constants as PMConstants} from '@adobe/cq-spa-page-model-manager';

/**
 * Useful variables for interacting with CQ/AEM components
 *
 * @namespace Constants
 */
const Constants = {

    /**
     * Name of the data-cq-data-path data attribute
     */
    DATA_PATH_ATTR: 'data-cq-data-path',

    /**
     * Class names associated with a new section component
     *
     * @type {string}
     */
    NEW_SECTION_CLASS_NAMES: 'new section',

    /**
     * Type of the item
     *
     * @type {string}
     */
    TYPE_PROP: PMConstants.TYPE_PROP,

    /**
     * List of child items of an item
     *
     * @type {string}
     */
    ITEMS_PROP: PMConstants.ITEMS_PROP,

    /**
     * Order in which the items should be listed
     *
     * @type {string}
     */
    ITEMS_ORDER_PROP: PMConstants.ITEMS_ORDER_PROP,

    /**
     * Path of the item
     *
     * @type {string}
     */
    PATH_PROP: PMConstants.PATH_PROP,

    /**
     * Children of an item
     *
     * @type {string}
     */
    CHILDREN_PROP: PMConstants.CHILDREN_PROP,

    /**
     * Hierarchical type of the item
     */
    HIERARCHY_TYPE_PROP: PMConstants.HIERARCHY_TYPE_PROP
};

export default Constants;
