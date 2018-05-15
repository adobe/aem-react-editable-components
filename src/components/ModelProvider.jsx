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
import {render, findDOMNode} from 'react-dom';
import Constants from '../Constants';
import HierarchyConstants from '../HierarchyConstants';
import {PageModelManager} from '@adobe/cq-spa-page-model-manager';

/**
 * Wrapper component responsible for synchronizing a child component with a given portion of the page model.
 * The location of the portion of the page model corresponds to the location of the resource in the page and is accessible via the data_path / page_path properties of the component.
 * Those properties are then output in the form of data attributes (data-cq-page-path and data-cq-data-path) to allow the editor to understand to which AEM resource this component corresponds.
 *
 * When the model gets updated the wrapped component gets re-rendered with the latest version of the model passed as the cq_model parameter.
 * <p>The ModelProvider supports content items as well as child pages</p>
 *
 * @class
 * @extends React.Component
 * @memberOf components
 *
 * @param {{}} props                      - the provided component properties
 * @param {string} props.data_path        - relative path of the current configuration in the overall page model
 * @param {string} props.page_path        - absolute path of the containing page
 * @param {boolean} props.force_reload    - should the cache be ignored
 */
class ModelProvider extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data_path: props && props.data_path ? props.data_path : '',
            page_path: props && props.page_path ? props.page_path : '',
            cq_model: props && props.cq_model
        };

        this.updateData();
    }

    /**
     * Updates the state and data of the current Object
     *
     * @protected
     */
    updateData() {
        const that = this;
        const path = this.state.data_path || '';

        // Fetching the latest data for the item at the given path
        this.getData().then(model => {
            if (!model) {
                return;
            }

            model[Constants.DATA_PATH_PROP] = path;

            that.setState({
                data_path: path,
                page_path: that.getPagePath(),
                cq_model: model
            });
        });
    }

    componentDidMount() {
        PageModelManager.addListener({pagePath: this.state.page_path, dataPath: this.state.data_path, callback: this.updateData.bind(this)});
    }

    componentWillUnmount() {
        // Clean up listener
        PageModelManager.removeListener({pagePath: this.state.page_path, dataPath: this.state.data_path, callback: this.updateData.bind(this)});
    }

    componentDidUpdate() {
        this.decorateChildElements();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data_path !== this.props.data_path || nextProps.page_path !== this.props.page_path) {
            // Path has been updated.
            const newDataPath = nextProps.data_path || '';
            const newPagePath = nextProps.page_path || '';
            // Remove old listener associated with the old location
            PageModelManager.removeListener({pagePath: this.state.page_path, dataPath: this.state.data_path, callback: this.updateData.bind(this)});
            // Add new listener on the new location.
            // We can not use state because it is not updated yet
            PageModelManager.addListener({pagePath: newPagePath, dataPath: newDataPath, callback: this.updateData.bind(this)});
            // Update state
            this.setState({page_path: newPagePath, data_path : newDataPath}, this.updateData.bind(this));
        }
    }

    /**
     * Returns the provided page path property
     *
     * @returns {string}
     *
     * @protected
     */
    getPagePath() {
        // 1. The model is hierarchical
        // 2. The page path is provided as a property
        return (this.state && this.state.cq_model && this.state.cq_model[Constants.PATH_PROP]) || this.props && this.props.page_path || '';
    }

    /**
     * Does the current component has a page model
     *
     * @returns {boolean}
     *
     * @protected
     */
    isPageModel() {
        return !!(this.state && this.state.cq_model && this.state.cq_model.hasOwnProperty(Constants.HIERARCHY_TYPE_PROP) && this.state.cq_model[Constants.HIERARCHY_TYPE_PROP] === HierarchyConstants.hierarchyType.page);
    }

    /**
     * Decorate a child {@link HTMLElement} with extra data attributes
     *
     * @param {HTMLElement} element     - Element to be decorated
     *
     * @protected
     */
    decorateChildElement(element) {
        if (!element) {
            return;
        }

        let childAttrs = {};

        let path = this.getPagePath();

        // a child page isn't a piece of content of the parent page
        if (this.isPageModel() && path) {
            childAttrs.cqPagePath = path;
        } else {
            childAttrs.cqDataPath = this.state.data_path;
        }

        Object.keys(childAttrs).forEach(attr => element.dataset[attr] = childAttrs[attr]);
    }

    /**
     * Decorate all the child {@link HTMLElement}s with extra data attributes
     *
     * @protected
     */
    decorateChildElements() {
        // for each child ref find DOM node and set attrs
        Object.keys(this.refs).forEach(ref => this.decorateChildElement(findDOMNode(this.refs[ref])))
    }

    /**
     * Returns the model data from the page model
     *
     * @returns {Promise}
     *
     * @protected
     */
    getData() {
        return PageModelManager.getData({pagePath: this.getPagePath(), dataPath: this.state.data_path, forceReload: this.props.force_reload});
    }

    render() {
        if (!this.props.children || this.props.children.length < 1) {
            return null;
        }

        // List and clone the children to passing the data as properties
        return Children.map(this.props.children, child =>
            React.cloneElement(child, { ref: this.state.data_path, cq_model: this.state.cq_model, cq_model_page_path: this.state.page_path, cq_model_data_path: this.state.data_path }));
    }
}

export default ModelProvider;