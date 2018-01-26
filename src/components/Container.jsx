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
import React, { Component } from 'react';
import Constants from '../Constants';
import { ComponentMapping } from '../ComponentMapping';
import ModelProvider from "./ModelProvider";

/**
 * Container component that provides the common features required by all containers such as the dynamic inclusion of child components
 *
 * @class
 * @memberOf components
 */
class Container extends Component {

    /**
     * Wrapper class in which the content is eventually wrapped
     *
     * @returns {ModelProvider}
     */
    get wrapper() {
        return ModelProvider;
    }

    /**
     * Returns the path of the current resource
     *
     * @returns {string|boolean}
     */
    get path() {
        return this.props && this.props.cq_model && this.props.cq_model.path;
    }

    get innerContent() {
        let that = this;
        let containerPath = this.path || this.props.path || '';

        // Prepare container path for concatenation
        if ('/' === containerPath) {
            containerPath = '';
        }

        containerPath = containerPath.length > 0 ? containerPath + '/' : containerPath;

        return this.props.cq_model && this.props.cq_model[Constants.ITEMS_ORDER_PROP].map(itemKey => {
            const item = that.props.cq_model[Constants.ITEMS_PROP][itemKey];
            item.path = containerPath + itemKey;

            // console.debug("Container.js", "add item", item.path, item, that);
            const type = item[Constants.TYPE_PROP];

            if (!type) {
                // console.debug("Container.js", "no type", item, that);
                return false;
            }

            // Get the constructor of the component to later be dynamically instantiated
            const DynamicComponent = ComponentMapping.get(type);

            if (!DynamicComponent) {
                // console.debug("Container.js", "no dynamic component", item, that);
                return false;
            }

            let Wrapper = this.wrapper;

            if (Wrapper) {
                return <Wrapper key={item.path} path={item.path}><DynamicComponent cq_model={item}/></Wrapper>
            }

            return <DynamicComponent cq_model={item}/>;
        });
    }

    render() {
        return <div>{this.innerContent}</div>;
    }
}

export default Container;