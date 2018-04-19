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
import { MapTo } from '../ComponentMapping';
import Container from './Container';
import ResponsiveColumnModelProvider from './ResponsiveColumnModelProvider';
import Constants from '../Constants';
import Utils from '../Utils';

const CONTAINER_CLASS_NAMES = 'aem-container';
const PLACEHOLDER_CLASS_NAMES = Constants.NEW_SECTION_CLASS_NAMES + ' aem-Grid-newComponent';

/**
 * Placeholder of the responsive grid component
 *
 * @class
 * @extends React.Component
 * @private
 */
class Placeholder extends Component {


    render() {
        return <div data-cq-data-path={this.props.cq_model && this.props.cq_model[Constants.DATA_PATH_PROP] + "/*"} className={PLACEHOLDER_CLASS_NAMES} />
    }
}

/**
 * Container that provides the capabilities of the responsive grid
 *
 * @class
 * @extends components.Container
 * @memberOf components
 *
 * @param {{}} props                                    - the provided component properties
 * @param {{}} [props.cq_model]                         - the page model configuration object
 * @param {string} [props.cq_model.gridClassNames]      - the grid class names as provided by the content services
 * @param {string} [props.cq_model.classNames]          - the class names as provided by the content services
 */
class ResponsiveGrid extends Container {

    constructor(props) {
        super(props);

        this.state = {
            cq_model: props.cq_model,
            classNames: '',
            gridClassNames: ''
        };
    }

    /**
     * Returns the class names of the grid element
     *
     * @returns {string|boolean}
     */
    get gridClassNames() {
        return this.props && this.props.cq_model && this.props.cq_model.gridClassNames;
    }

    /**
     * Provides the class names of the grid wrapper
     *
     * @returns {string}
     */
    get classNames() {
        if (!this.props || !this.props.cq_model) {
            return '';
        }

        let classNames = CONTAINER_CLASS_NAMES;

        if (this.props.cq_model.classNames) {
            classNames += ' ' + this.props.cq_model.classNames;
        }

        if (this.props.cq_model.columnClassNames) {
            classNames += ' ' + this.props.cq_model.columnClassNames;
        }

        return classNames;
    }

    /**
     * Returns the content of the responsive grid placeholder
     * @returns {{}}
     */
    get placeholder() {
        // Add a grid placeholder when the page is being authored
        if (Utils.isInEditor()) {
            return <Placeholder {...this.props} />;
        }
    }

    /**
     * @inheritDoc
     * @returns {ResponsiveColumnModelProvider}
     */
    get modelProvider() {
        return ResponsiveColumnModelProvider;
    }

    render() {
        return (
            <div className={this.classNames}>
                <div className={this.gridClassNames}>
                    {this.innerContent}
                    {this.placeholder}
                </div>
            </div>
        )
    }
}

export default MapTo('wcm/foundation/components/responsivegrid')(ResponsiveGrid);
