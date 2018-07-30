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
import ModelProvider from './ModelProvider';
import React from 'react';
import Constants from '../Constants';

const RESPONSIVE_COLUMN_CLASS_NAME_PATTERN = /aem-GridColumn([^ ])*/g;

/**
 * Model provider specific to the components identified as responsive columns
 *
 * @class
 * @extends ModelProvider
 * @memberOf components
 */
class ResponsiveColumnModelProvider extends ModelProvider {
    get childAttrs() {
        let childAttrs = super.childAttrs;
        childAttrs['className'] = this.state.cqModel.columnClassNames;
        return childAttrs;
    }

    get childIsResponsiveGrid() {
        return this.state.cqModel && this.state.cqModel[Constants.TYPE_PROP] === 'wcm/foundation/components/responsivegrid';
    }

    render() {
        if (!this.props.children || this.props.children.length < 1) {
            return null;
        }
        // List and clone the children to passing the data as properties
        let cloneEl = React.cloneElement(this.props.children, { ref: this.state.dataPath, cqModel: this.state.cqModel, cqModelPagePath: this.state.pagePath, cqModelDataPath: this.state.dataPath });
        if (!this.childIsResponsiveGrid) {
            return <div { ...this.childAttrs }>
                { cloneEl }
            </div>;
        } else {
            return cloneEl
        }
    }
}

export default ResponsiveColumnModelProvider;