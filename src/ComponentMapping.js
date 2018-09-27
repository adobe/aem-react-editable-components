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
import React from "react";
import { ComponentMapping } from '@adobe/cq-spa-component-mapping';
import { withModel } from "./components/ModelProvider";
import { withEditorContext } from "./EditorContext";

/**
 * Wrapped function
 *
 * @type {function}
 * @private
 */
let wrappedMapFct = ComponentMapping.map;

let editConfigMap = {};

/**
 * Stores the given {@link EditConfig} for the given resource types
 * @param {string[]} resourceTypes
 * @param {EditConfig} editConfig
 */
function storeEditConfig(resourceTypes, editConfig) {
    if (editConfig) {
        if (Array.isArray(resourceTypes)) {
            resourceTypes.forEach((resourceType) => editConfigMap[resourceType] = editConfig);
        } else {
            editConfigMap[resourceTypes] = editConfig;
        }
    }
}

/**
 * Returns the {@link EditConfig} object registered for the given resource type
 * @param {string} resourceType - Resource type the {@link EditConfig} has been registered with
 * @return {*}
 */
function getEditConfig(resourceType) {
    return editConfigMap && resourceType && editConfigMap[resourceType];
}

/**
 * Map a React component with the given resource types. If an {@link EditConfig} is provided the <i>clazz</i> is wrapped to provide edition capabilities on the AEM Page Editor
 *
 * @param {string[]} resourceTypes                      - list of resource types for which to use the given <i>clazz</i>
 * @param {React.Component} component                   - class to be instantiated for the given resource types
 * @param {EditConfig} [editConfig]                     - configuration object for enabling the edition capabilities
 * @param {{}} [config]                                 - general configuration object
 * @param {boolean} [config.forceReload=undefined]      - should the model cache be ignored when processing the component
 * @returns {React.Component}                           - the resulting decorated Class
 */
ComponentMapping.map = function map (resourceTypes, component, editConfig, config) {
        config = config || {};
        let innerComponent = component;

        storeEditConfig(resourceTypes, editConfig);

        innerComponent = withEditorContext(withModel(innerComponent, config));

        wrappedMapFct.call(ComponentMapping, resourceTypes, innerComponent);
        
        return innerComponent;
    };

function MapTo(resourceTypes) {
    return (clazz, editConfig) => {
        return ComponentMapping.map(resourceTypes, clazz, editConfig);
    };
}

const ComponentMappingContext = React.createContext(ComponentMapping);

const withComponentMappingContext = (Component) => {
    return (props) => (
        <ComponentMappingContext.Consumer>
            {componentMapping =>  <Component {...props} componentMapping={componentMapping} />}
        </ComponentMappingContext.Consumer>)
};

export {ComponentMapping, MapTo, ComponentMappingContext, withComponentMappingContext, storeEditConfig, getEditConfig};