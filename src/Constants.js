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

/**
 * Useful variables for interacting with CQ/AEM components
 */
const Constants = {

    /**
     * Class names associated with a new section component
     *
     * @type {string}
     */
    NEW_SECTION_CLASS_NAMES: 'new section',

    /**
     * Selector that identifies the page is being authored by the page editor
     *
     * @type {string}
     */
    IN_EDITOR_SELECTOR: '[data-cq-editor]',

    /**
     * Type of the item
     *
     * @type {string}
     */
    TYPE_PROP: ':type',

    /**
     * List of child items of an item
     *
     * @type {string}
     */
    ITEMS_PROP: ':items',

    /**
     * Order in which the items should be listed
     *
     * @type {string}
     */
    ITEMS_ORDER_PROP: ':itemsOrder'
};

export default Constants;
