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
import React, {Component, Children} from 'react';
import { render, findDOMNode } from 'react-dom';
import PageModelManager from '@cq/cq-spa-page-model-manager';

/**
 * Wrapper component responsible for synchronizing a child component with a give portion of the page model
 *
 * @class
 * @memberOf components
 */
class ModelProvider extends Component {

    constructor(props) {
        super(props);

        this.state = {
            path: props && props.path ? props.path : '',
            cq_model: props && props.cq_model
        };

        this.updateData();
    }

    /**
     * Updates the state and data of the current Object
     */
    updateData() {
        const that = this;
        const path = this.state.path || '';

        // Fetching the latest data for the item at the given path
        this.getData(path).then(model => {
            if (!model) {
                return;
            }

            model.path = path;

            that.setState({
                cq_model: model
            });
        });
    }

    componentDidMount() {
        PageModelManager.addListener(this.state.path, this.updateData.bind(this));
    }

    componentWillUnmount() {
        // Clean up listener
        PageModelManager.removeListener(this.state.path, this.updateData.bind(this));
    }

    componentDidUpdate() {
        this.decorateChildElements();
    }

    /**
     * Decorate a child {@link HTMLElement} with extra data attributes
     *
     * @param {HTMLElement} element Element to be decorated
     */
    decorateChildElement(element) {
        if (!element) {
            return;
        }

        const childAttrs = {cqContentPath: this.state.path};
        Object.keys(childAttrs).forEach(attr => element.dataset[attr] = childAttrs[attr]);
    }

    /**
     * Decorate all the child {@link HTMLElement}s with extra data attributes
     */
    decorateChildElements() {
        // for each child ref find DOM node and set attrs
        Object.keys(this.refs).forEach(ref => this.decorateChildElement(findDOMNode(this.refs[ref])))
    }

    /**
     * Gets the model data from the page model
     *
     * @param {String} path Location of the data in the page model
     * @returns {Promise}
     */
    getData(path) {
        path = path || this.state.path;

        return PageModelManager.getData(path);
    }

    render() {
        if (!this.props.children || this.props.children.length < 1) {
            return null;
        }

        // List and clone the children to passing the data as properties
        return Children.map(this.props.children, child =>
            React.cloneElement(child, { ref: this.state.path, cq_model: this.state.cq_model }));
    }
}

export default ModelProvider;