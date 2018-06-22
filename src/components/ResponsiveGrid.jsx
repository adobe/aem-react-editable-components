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
        return <div data-cq-data-path={this.props.cqModel && this.props.cqModel[Constants.DATA_PATH_PROP] + "/*"} className={PLACEHOLDER_CLASS_NAMES} />
    }
}

/**
 * Container that provides the capabilities of the responsive grid.
 *
 * Like the Container component, the ResponsiveGrid dynamically resolves and includes child component classes.
 * Instead of using a ModelProvider it uses a ResponsiveColumnModelProvider that will - on top of providing access to the model - also decorate the rendered elements with class names relative to the layout.
 *
 * @class
 * @extends components.Container
 * @memberOf components
 *
 * @param {{}} props                                    - the provided component properties
 * @param {{}} [props.cqModel]                         - the page model configuration object
 * @param {string} [props.cqModel.gridClassNames]      - the grid class names as provided by the content services
 * @param {string} [props.cqModel.classNames]          - the class names as provided by the content services
 */
class ResponsiveGrid extends Container {

    constructor(props) {
        super(props);

        this.state = {
            cqModel: props.cqModel,
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
        return this.props && this.props.cqModel && this.props.cqModel.gridClassNames;
    }

    /**
     * Provides the class names of the grid wrapper
     *
     * @returns {string}
     */
    get classNames() {
        if (!this.props || !this.props.cqModel) {
            return '';
        }

        let classNames = CONTAINER_CLASS_NAMES;

        if (this.props.cqModel.classNames) {
            classNames += ' ' + this.props.cqModel.classNames;
        }

        if (this.props.cqModel.columnClassNames) {
            classNames += ' ' + this.props.cqModel.columnClassNames;
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
