/*
 * ADOBE CONFIDENTIAL
 *
 * Copyright 2020 Adobe Systems Incorporated
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

import PropTypes from 'prop-types';
import React, { Component } from 'react';

export interface PlaceHolderModel extends Object {
    placeholderClassNames: string;
    cqPath: string;
}

/**
 * Placeholder of the Container component.
 *
 * @class
 * @extends React.Component
 * @private
 */
export class ContainerPlaceholder<P extends PlaceHolderModel> extends Component<P> {
    public static get propTypes() {
        return {
            cqPath: PropTypes.string,
            placeholderClassNames: PropTypes.string,
        };
    }

    constructor(props: P) {
        super(props);
    }

    public render() {
        return <div data-cq-data-path={this.props.cqPath + '/*'} className={this.props.placeholderClassNames} />;
    }
}
