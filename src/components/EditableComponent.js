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
import { getEditConfig } from "../ComponentMapping";
import Constants from "../Constants";

/**
 * Class name used to identify the placeholder used to represent an empty component
 *
 * @private
 */
const PLACEHOLDER_CLASS_NAME = 'cq-placeholder';

/**
 * The EditableComponent extends components with editing capabilities
 */
class EditableComponent extends Component {

    /**
     * Provides access to the {@link EditConfig} for the current child resource type
     * @return {*}
     */
    get editConfig() {
        const resourceType = this.props && this.props.cqType;

        if(!resourceType) {
            return;
        }

        return getEditConfig(resourceType);
    }

    /**
     * Properties related to the edition of the component
     */
    get editProps() {
        let eProps = {};

        if (!this.props.isInEditor) {
            return eProps;
        }

        eProps[Constants.DATA_PATH_ATTR] = this.props.cqPath;

        return eProps;
    }

    /**
     * HTMLElement representing the empty placeholder
     * @return {*}
     */
    get emptyPlaceholder() {
        if (!this.useEmptyPlaceholder()) {
            return;
        }

        return <div data-emptytext={this.editConfig.emptyLabel} className={PLACEHOLDER_CLASS_NAME}/>;
    }

    /**
     * Should an empty placeholder be added
     *
     * @return {boolean}
     */
    useEmptyPlaceholder() {
        return this.props.isInEditor && this.props.children && this.editConfig && typeof this.editConfig.isEmpty === 'function' && this.editConfig.isEmpty(this.props);
    }

    render() {
        return <div {...this.editProps} {...this.props.containerProps}>
            {this.props.children}
            {this.emptyPlaceholder}
            </div>;
    }
}

export { EditableComponent, PLACEHOLDER_CLASS_NAME };