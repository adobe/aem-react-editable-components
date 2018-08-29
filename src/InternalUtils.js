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
 * Internal Helper functions for interacting with the AEM environment
 *
 * @namespace InternalUtils
 */
const InternalUtils = {

    /**
     * Transforms the item data to component properties
     * It will replace ":" with "cq" and convert the name to CameCase
     *
     * @private
     * @param   {Object} item - the item data
     * @returns {Object} the transformed data
     */
    modelToProps(item) {
        let keys = Object.getOwnPropertyNames(item);
        let props = {};

        keys.forEach((key) => {
            let propKey = key;

            if (propKey.startsWith(":")) {
                // Transformation of internal properties namespaced with [:] to [cq]
                // :myProperty => cqMyProperty
                let tempKey = propKey.substr(1);
                propKey = "cq" + tempKey.substr(0, 1).toUpperCase() + tempKey.substr(1);
            }

            props[propKey] = item[key];
        });

        return props;
    }
};

export default InternalUtils;
