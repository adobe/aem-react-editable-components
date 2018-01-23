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
import { ComponentMapping } from '@cq/spa-component-mapping';
import EditableComponentComposer from "./edit/EditableComponentComposer";

/**
 * Wrapped function
 *
 * @type {function}
 * @private
 */
let wrappedMapFct = ComponentMapping.map;

/**
 * Map a React component with the given resource types. If an {@code editClass} is provided the {@code clazz} is wrapped to provide edition capabilities on the AEM Page Editor
 *
 * @param {string[]} resourceTypes      list of resource types for which to use the given {@code clazz}
 * @param {class} clazz                 class to be instantiated for the given resource types
 * @param {EditConfig} editConfig       configuration object for enabling the edition capabilities
 * @returns {class}                     the resulting decorated Class
 *
 * @exports ComponentMapping
 */
ComponentMapping.map = function map (resourceTypes, clazz, editConfig) {
        let innerClass = clazz;

        if (editConfig) {
            innerClass = EditableComponentComposer.compose(clazz, editConfig);
        }

        wrappedMapFct.call(ComponentMapping, resourceTypes, innerClass);

        return innerClass;
    };

function MapTo(resourceTypes) {
    return (clazz, editClass) => {
        return ComponentMapping.map(resourceTypes, clazz, editClass);
    };
}

export {ComponentMapping, MapTo};