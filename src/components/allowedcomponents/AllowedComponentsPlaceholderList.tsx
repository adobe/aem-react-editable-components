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
import { PlaceHolderModel } from '../ContainerPlaceholder';
import { AllowedComponent } from './AllowedComponentsContainer';
import { AllowedComponentPlaceholder } from './AllowedComponentsPlaceholder';

const ALLOWED_PLACEHOLDER_CLASS_NAMES = 'aem-AllowedComponent--list';
const ALLOWED_COMPONENT_TITLE_CLASS_NAMES = 'aem-AllowedComponent--title';

export interface AllowedComponentPlaceholderListProperties {
    title: string;
    emptyLabel: string;
    components: AllowedComponent[];
    placeholderProps: PlaceHolderModel;
    cqPath: string;
}
/**
 * List of placeholder of the Allowed Component Container component.
 *
 * @class
 * @extends React.Component
 * @private
 */
export class AllowedComponentPlaceholderList<P extends AllowedComponentPlaceholderListProperties, S> extends Component<P, S> {
    public static get propTypes() {
        return {
            components: PropTypes.arrayOf(PropTypes.shape({
                path: PropTypes.string,
                title: PropTypes.string
            })),
            cqPath: PropTypes.string,
            emptyLabel: PropTypes.string,
            placeholderClassNames: PropTypes.string,
            title: PropTypes.string
        };
    }

    public render() {
        const { components, placeholderProps, title, emptyLabel } = this.props;
        const listLabel = (components && (components.length > 0)) ? title : emptyLabel;

        return (
            <div className={ALLOWED_PLACEHOLDER_CLASS_NAMES + ' ' + placeholderProps.placeholderClassNames}>
                <div data-text={listLabel} className={ALLOWED_COMPONENT_TITLE_CLASS_NAMES} />
                {components.map((component, i) =>
                    <AllowedComponentPlaceholder key={i} path={component.path} emptyLabel={component.title} />,
                )}
            </div>
        );
    }
}
