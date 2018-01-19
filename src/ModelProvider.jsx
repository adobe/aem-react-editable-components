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
import React, {Component, Children} from 'react';
import { render, findDOMNode } from 'react-dom';
import PageModelManager from '@cq/spa-page-model-manager';

class ModelProvider extends Component {

    constructor(props) {
        super(props);

        this.state = {};

        if (props) {
            this.state.path = props.path;
            this.state.cq_model = props.cq_model;
        }

        this.updateData();
    }

    /**
     * Updates the state and data of the current Object
     */
    updateData() {
        let that = this;

        // Fetching the latest data for the item at the given path
        this.getData(this.props.path).then(model => {
            if (!model) {
                return;
            }

            model.path = that.props.path;
            that.setState({
                path: that.props.path,
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

    decorateChildElement(element) {
        if (!element) {
            return;
        }

        if (this.props.path && this.props.path.trim().length > 0) {
            const childAttrs = {cqContentPath: this.props.path};
            Object.keys(childAttrs).forEach(attr => element.dataset[attr] = childAttrs[attr]);
        }
    }

    /**
     * Decorates the children html with extra data attributes
     */
    decorateChildElements() {
        // for each child ref find DOM node and set attrs
        Object.keys(this.refs).forEach(ref => this.decorateChildElement(findDOMNode(this.refs[ref])))
    }

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
            React.cloneElement(child, { ref: this.props.path, cq_model: this.state.cq_model }));
    }
}

export default ModelProvider;