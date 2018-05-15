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
import React, {Component} from 'react';
import Constants from '../Constants';
import HierarchyConstants from '../HierarchyConstants';
import {ComponentMapping} from '../ComponentMapping';
import ModelProvider from "./ModelProvider";

/**
 * Container component that provides the common features required by all containers such as the dynamic inclusion of child components.
 * <p>The Container supports content items as well as child pages</p>
 *
 * @class
 * @extends React.Component
 * @memberOf components
 *
 *
 * @param {{}} props                                - the provided component properties
 * @param {{}} [props.cq_model]                     - the page model configuration object
 * @param {string} [props.cq_model.:dataPath]       - relative path of the current configuration in the overall page model
 */
class Container extends Component {

    /**
     * Wrapper class in which the content is eventually wrapped
     *
     * @returns {ModelProvider}
     *
     * @protected
     */
    get modelProvider() {
        return ModelProvider;
    }

    /**
     * Returns the path of the page the current component is part of
     *
     * @returns {*}
     *
     * @protected
     */
    getPagePath() {
        return this.props && this.props.cq_model && this.props.cq_model[Constants.PATH_PROP] || this.props.cq_model_page_path;
    }

    /**
     * Returns the {@link React.Component} mapped to the type of the item
     * @param {{}} item     - item of the model
     * @returns {boolean}
     *
     * @protected
     */
    getDynamicComponent(item) {
        if (!item) {
            return false;
        }

        // console.debug("Container.js", "add item", item.path, item, that);
        const type = item[Constants.TYPE_PROP];

        if (!type) {
            // console.debug("Container.js", "no type", item, that);
            return false;
        }

        // Get the constructor of the component to later be dynamically instantiated
        return ComponentMapping.get(type);
    }

    /**
     * Returns the component optionally wrapped into the current ModelProvider implementation
     *
     * @param {string} field                    - name of the field where the item is located
     * @param {string} itemKey                  - map key where the item is located in the field
     * @param {string} containerDataPath        - relative path of the item's container
     * @param {function} propertiesCallback     - properties to dynamically decorate the wrapper element with
     * @returns {React.Component}
     *
     * @protected
     */
    getWrappedDynamicComponent(field, itemKey, containerDataPath, propertiesCallback) {
        if (!this.props.cq_model[field]) {
            return false;
        }

        const item = this.props.cq_model[field][itemKey];

        if (!item) {
            return false;
        }

        item[Constants.DATA_PATH_PROP] = containerDataPath + itemKey;

        const DynamicComponent = this.getDynamicComponent(item);

        if (!DynamicComponent) {
            // console.debug("Container.js", "no dynamic component", item, that);
            return false;
        }

        let Wrapper = this.modelProvider;

        if (Wrapper) {
            propertiesCallback = propertiesCallback || function noOp(){return {}};

            return <Wrapper key={item[Constants.DATA_PATH_PROP]} {...propertiesCallback()}><DynamicComponent cq_model={item} cq_model_page_path={this.props.cq_model_page_path} cq_model_data_path={this.props.cq_model_data_path}/></Wrapper>
        }

        return <DynamicComponent cq_model={item} cq_model_page_path={this.props.cq_model_page_path} cq_model_data_path={this.props.cq_model_data_path}/>;
    }

    /**
     * Returns a list of item instances
     *
     * @param containerDataPath             - relative path of the item's container
     * @returns {React.Component[]}
     *
     * @protected
     */
    getDynamicItemComponents(containerDataPath) {
        let dynamicComponents =  [];

        this.props.cq_model && this.props.cq_model[Constants.ITEMS_ORDER_PROP] && this.props.cq_model[Constants.ITEMS_ORDER_PROP].forEach(itemKey => {
            dynamicComponents.push(this.getWrappedDynamicComponent(Constants.ITEMS_PROP, itemKey, containerDataPath,  () => {
                let dataPath = containerDataPath + itemKey;
                // either the model contains page path fields or we use the propagated value
                let pagePath = this.getPagePath();

                return {
                    data_path: dataPath,
                    page_path: pagePath
                }
            }));
        });

        return dynamicComponents || [];
    }

    /**
     * Returns a list of page instances
     *
     * @param containerDataPath             - relative path of the item's container
     * @returns {React.Component[]}
     *
     * @protected
     */
    getDynamicPageComponents(containerDataPath) {
        if (!this.props.cq_model || this.props.cq_model[Constants.HIERARCHY_TYPE_PROP] !== HierarchyConstants.hierarchyType.page || !this.props.cq_model[Constants.CHILDREN_PROP]) {
            return [];
        }

        let dynamicComponents = [];

        const model = this.props.cq_model[Constants.CHILDREN_PROP];

        for (let itemKey in model) {
            if (model.hasOwnProperty(itemKey)) {
                dynamicComponents.push(this.getWrappedDynamicComponent(Constants.CHILDREN_PROP, itemKey, containerDataPath, () => {
                    return {
                        page_path: itemKey
                    }
                }));
            }
        }

        return dynamicComponents || [];
    }

    /**
     * Returns the path of the current resource
     *
     * @returns {string|undefined}
     *
     * @protected
     */
    get path() {
        return this.props && this.props.cq_model && this.props.cq_model[Constants.DATA_PATH_PROP];
    }

    /**
     * Returns a list of child components
     *
     * @returns {Array.<React.Component>}
     *
     * @protected
     */
    get innerContent() {
        let containerPath = this.path || this.props.data_path || '';

        // Prepare container path for concatenation
        if ('/' === containerPath) {
            containerPath = '';
        }

        containerPath = containerPath.length > 0 ? containerPath + '/' : containerPath;

        let dynamicComponents = this.getDynamicItemComponents(containerPath);

        return dynamicComponents.concat(this.getDynamicPageComponents(containerPath));
    }

    render() {
        return <div>{this.innerContent}</div>;
    }
}

export default Container;