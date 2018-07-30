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
 * @param {{}} [props.cqModel]                     - the page model configuration object
 * @param {string} [props.cqModel.:dataPath]       - relative path of the current configuration in the overall page model
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
        return this.props && this.props.cqModel && this.props.cqModel[Constants.PATH_PROP] || this.props.cqModelPagePath;
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
     * @param {Object} item - The item to create the component from
     * @param {function} propertiesCallback     - properties to dynamically decorate the wrapper element with
     * @returns {React.Component}
     *
     * @protected
     */
    getWrappedDynamicComponent(item, key, propertiesCallback) {
        if (!item) {
            return false;
        }

        const DynamicComponent = this.getDynamicComponent(item);

        if (!DynamicComponent) {
            // console.debug("Container.js", "no dynamic component", item, that);
            return false;
        }
        let Wrapper = this.modelProvider;
        if (Wrapper) {
            propertiesCallback = propertiesCallback || function noOp(){return {}};
            return <Wrapper key={key} {...propertiesCallback() }><DynamicComponent cqModel={item} cqModelPagePath={this.props.cqModelPagePath} cqModelDataPath={this.props.cqModelDataPath}/></Wrapper>
        }

        return <DynamicComponent cqModel={item} cqModelPagePath={this.props.cqModelPagePath} cqModelDataPath={this.props.cqModelDataPath}/>;
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

        this.props.cqModel && this.props.cqModel[Constants.ITEMS_ORDER_PROP] && this.props.cqModel[Constants.ITEMS_ORDER_PROP].forEach(itemKey => {
            let item = this.props.cqModel[Constants.ITEMS_PROP][itemKey];

            let dataPath = containerDataPath + itemKey;
            dynamicComponents.push(this.getWrappedDynamicComponent(item, dataPath, () => {
                let pagePath = this.getPagePath();
                return {
                    dataPath: dataPath,
                    pagePath: pagePath,
                    cqModel: this.props.cqModel[Constants.ITEMS_PROP][itemKey]
                }
            }));
            // [TODO] - Revisit the need of this DATA_PATH_PROP field as it is adding more data to the model
            // just on the scope of the react-editable component
            // We should not alter the model directly from the view
            // Reference ticket : https://jira.corp.adobe.com/browse/CQ-4248816
            // either the model contains page path fields or we use the propagated value
            item[Constants.DATA_PATH_PROP] = dataPath;
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
        if (!this.props.cqModel || this.props.cqModel[Constants.HIERARCHY_TYPE_PROP] !== HierarchyConstants.hierarchyType.page || !this.props.cqModel[Constants.CHILDREN_PROP]) {
            return [];
        }

        let dynamicComponents = [];

        const model = this.props.cqModel[Constants.CHILDREN_PROP];

        for (let itemKey in model) {
            if (model.hasOwnProperty(itemKey)) {
                let dataPath = containerDataPath + itemKey;
                let dynamicComponent = this.getWrappedDynamicComponent(model[itemKey], dataPath, () => {
                    return {
                        pagePath: itemKey,
                        cqModel: model[itemKey]
                    }
                });
                dynamicComponents.push(dynamicComponent);
            }
        }

        return dynamicComponents || [];
    }

    /**
     * Does the current component has a page model
     *
     * @returns {boolean}
     *
     * @protected
     */
    isPageModel() {
        return !!(this.props && this.props.cqModel && this.props.cqModel.hasOwnProperty(Constants.HIERARCHY_TYPE_PROP) && this.props.cqModel[Constants.HIERARCHY_TYPE_PROP] === HierarchyConstants.hierarchyType.page);
    }

    get childAttrs() {
        let attrs = {};

        let path = this.getPagePath();

        // a child page isn't a piece of content of the parent page
        if (this.isPageModel() && path) {
            attrs["data-cq-page-path"] = path;
        } else if (this.props && (this.props.dataPath || this.props.cqModelDataPath)) {
            attrs["data-cq-data-path"] = this.props.dataPath || this.props.cqModelDataPath;
        }
        return attrs;
    }


    /**
     * Returns the path of the current resource
     *
     * @returns {string|undefined}
     *
     * @protected
     */
    get path() {
        return this.props && this.props.cqModel && this.props.cqModel[Constants.DATA_PATH_PROP];
    }

    /**
     * Returns a list of child components
     *
     * @returns {Array.<React.Component>}
     *
     * @protected
     */
    get innerContent() {
        let containerPath = this.path || this.props.dataPath || '';

        // Prepare container path for concatenation
        if ('/' === containerPath) {
            containerPath = '';
        }

        containerPath = containerPath.length > 0 ? containerPath + '/' : containerPath;
        let dynamicComponents = this.getDynamicItemComponents(containerPath);
        return dynamicComponents.concat(this.getDynamicPageComponents(containerPath));
    }

    render() {
        return <div { ...this.childAttrs }>{this.innerContent}</div>;
    }
}

export default Container;