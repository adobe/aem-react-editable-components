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

import PropTypes from 'prop-types';
import React, { Component } from 'react';

const ALLOWED_COMPONENT_PLACEHOLDER_CLASS_NAMES = 'aem-AllowedComponent--component cq-placeholder placeholder';

export interface AllowedComponentPlaceHolderProperties {
    emptyLabel: string;
    path: string;
}

/**
 * Placeholder for one Allowed Component.
 */
export class AllowedComponentPlaceholder<P extends AllowedComponentPlaceHolderProperties, S> extends Component<P, S> {
    public static get propTypes() {
        return {
            emptyLabel: PropTypes.string,
            path: PropTypes.string
        };
    }

    public render() {
        const { path, emptyLabel } = this.props;

        return <div data-cq-data-path={path} data-emptytext={emptyLabel} className={ALLOWED_COMPONENT_PLACEHOLDER_CLASS_NAMES} />;
    }
}
