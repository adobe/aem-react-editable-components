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
 * The location of the portion of the page model corresponds to the location of the resource in the page and is accessible via the dataPath / pagePath properties of the component.
 * Those properties are then output in the form of data attributes (data-cq-page-path and data-cq-data-path) to allow the editor to understand to which AEM resource this component corresponds.
 *
 * When the model gets updated the wrapped component gets re-rendered with the latest version of the model passed as the cqModel parameter.
 * <p>The ModelProvider supports content items as well as child pages</p>
 *
 * @class
 * @extends React.Component
 * @memberOf components
 *
 * @param {{}} props                      - the provided component properties
 * @param {string} props.dataPath        - relative path of the current configuration in the overall page model
 * @param {string} props.pagePath        - absolute path of the containing page
 * @param {boolean} props.forceReload    - should the cache be ignored
 */
class ModelProvider extends Component {

    constructor(props) {
        super(props);

        this.state = {
            dataPath: props && props.dataPath ? props.dataPath : '',
            pagePath: props && props.pagePath ? props.pagePath : '',
            cqModel: props && props.cqModel
        };
        this.state.childAttrs = this.childAttrs;
        this.updateData();
    }

    /**
     * Updates the state and data of the current Object
     *
     * @protected
     */
    updateData() {
        const that = this;
        const path = this.state.dataPath || '';

        // Fetching the latest data for the item at the given path
        this.getData().then(model => {
            if (!model) {
                return;
            }

            model[Constants.DATA_PATH_PROP] = path;

            that.setState({
                dataPath: path,
                pagePath: that.getPagePath(),
                cqModel: model
            });
        });
    }

    componentDidMount() {
        PageModelManager.addListener({pagePath: this.state.pagePath, dataPath: this.state.dataPath, callback: this.updateData.bind(this)});
    }

    componentWillUnmount() {
        // Clean up listener
        PageModelManager.removeListener({pagePath: this.state.pagePath, dataPath: this.state.dataPath, callback: this.updateData.bind(this)});
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.dataPath !== this.props.dataPath || nextProps.pagePath !== this.props.pagePath) {
            // Path has been updated.
            const newDataPath = nextProps.dataPath || '';
            const newPagePath = nextProps.pagePath || '';
            // Remove old listener associated with the old location
            PageModelManager.removeListener({pagePath: this.state.pagePath, dataPath: this.state.dataPath, callback: this.updateData.bind(this)});
            // Add new listener on the new location.
            // We can not use state because it is not updated yet
            PageModelManager.addListener({pagePath: newPagePath, dataPath: newDataPath, callback: this.updateData.bind(this)});
            // Update state
            this.setState({pagePath: newPagePath, dataPath : newDataPath}, this.updateData.bind(this));
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
        return (this.state && this.state.cqModel && this.state.cqModel[Constants.PATH_PROP]) || this.props && this.props.pagePath || '';
    }

    /**
     * Does the current component has a page model
     *
     * @returns {boolean}
     *
     * @protected
     */
    isPageModel() {
        return !!(this.state && this.state.cqModel && this.state.cqModel.hasOwnProperty(Constants.HIERARCHY_TYPE_PROP) && this.state.cqModel[Constants.HIERARCHY_TYPE_PROP] === HierarchyConstants.hierarchyType.page);
    }

    get childAttrs() {
        let attrs = {};

        let path = this.getPagePath();

        // a child page isn't a piece of content of the parent page
        if (this.isPageModel() && path) {
            attrs["data-cq-page-path"] = path;
        } else if (this.state.dataPath) {
            attrs["data-cq-data-path"] = this.state.dataPath;
        }
        return attrs;
    }


    /**
     * Returns the model data from the page model
     *
     * @returns {Promise}
     *
     * @protected
     */
    getData() {
        return PageModelManager.getData({pagePath: this.getPagePath(), dataPath: this.state.dataPath, forceReload: this.props.forceReload});
    }

    render() {
        if (!this.props.children || this.props.children.length < 1) {
            return null;
        }
        // List and clone the children to passing the data as properties
        let element = React.cloneElement(this.props.children, { ref: this.state.dataPath, cqModel: this.state.cqModel, cqModelPagePath: this.state.pagePath, cqModelDataPath: this.state.dataPath });
        return <div { ...this.childAttrs }>{ element } </div>;
    }
}

export default ModelProvider;