/*
 * ADOBE CONFIDENTIAL
 *
 * Copyright 2017 Adobe Systems Incorporated
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
 * Required configuration for authoring capabilities
 */
class AbstractEdit {

    /**
     * Label to be displayed by the placeholder when the component is empty. Optionally returns an empty text value. In case the value is undefined the page editor should take over
     *
     * @returns {string}
     */
    get emptyLabel() {
        return '';
    }

    /**
     * Should the component be empty
     *
     * @returns {boolean}
     */
    isEmpty() {
        throw new Error('isEmpty function must be implemented');
    }

    /**
     * If defined, adds a specific class name enabling the drag and drop functionality
     *
     * @returns {string}
     */
    get dragDropName() {
        return undefined;
    }
}

export default AbstractEdit;
