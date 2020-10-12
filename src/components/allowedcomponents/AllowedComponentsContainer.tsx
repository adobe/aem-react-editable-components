/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import React from 'react';
import { Container, ContainerProperties, ContainerState } from '../Container';
import { AllowedComponentPlaceholderList } from './AllowedComponentsPlaceholderList';

/**
 * Component that is allowed to be used on the page by the editor.
 */
export interface AllowedComponent {
    path: string;
    title: string;
}

export interface AllowedComponents {
    /**
     * Should AllowedComponents list be applied.
     */
    applicable: boolean;
    components: AllowedComponent[];
}

export interface AllowedComponentsProperties extends ContainerProperties {
    _allowedComponentPlaceholderListEmptyLabel?: string;
    allowedComponents: AllowedComponents;
    title: string;
}

/**
 * Represents allowed components container in AEM.
 */
export class AllowedComponentsContainer<M extends AllowedComponentsProperties, S extends ContainerState> extends Container<M, S> {
    public static defaultProps = {
        _allowedComponentPlaceholderListEmptyLabel: 'No allowed components',
        cqItems: {},
        cqItemsOrder: [],
        cqPath: ''
    };

    public render(): JSX.Element {
        const { allowedComponents, _allowedComponentPlaceholderListEmptyLabel, title, isInEditor } = this.props;

        if (isInEditor && allowedComponents && allowedComponents.applicable) {
            const emptyLabel = _allowedComponentPlaceholderListEmptyLabel as string
                               || AllowedComponentsContainer.defaultProps._allowedComponentPlaceholderListEmptyLabel;

            if (_allowedComponentPlaceholderListEmptyLabel) {
                return <AllowedComponentPlaceholderList
                    title={title}
                    emptyLabel={emptyLabel}
                    components={allowedComponents.components}
                    placeholderProps={this.placeholderProps}
                    cqPath={this.props.cqPath}/>;
            }
        }

        return super.render();
    }
}
