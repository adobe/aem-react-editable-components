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

import React, { Component } from 'react';
import { PlaceHolderModel } from '../ContainerPlaceholder';
import { AllowedComponent } from './AllowedComponentsContainer';
import { AllowedComponentPlaceholder } from './AllowedComponentsPlaceholder';

/**
 * @private
 */
const ALLOWED_PLACEHOLDER_CLASS_NAMES = 'aem-AllowedComponent--list';
/**
 * @private
 */
const ALLOWED_COMPONENT_TITLE_CLASS_NAMES = 'aem-AllowedComponent--title';

/**
 * @private
 */
export interface AllowedComponentPlaceholderListProperties {
    title: string;
    emptyLabel: string;
    components: AllowedComponent[];
    placeholderProps: PlaceHolderModel;
    cqPath: string;
}

/**
 * List of placeholder of the Allowed Component Container.
 *
 * @private
 */
export class AllowedComponentPlaceholderList<P extends AllowedComponentPlaceholderListProperties, S> extends Component<P, S> {

    public render() {
        const { components, placeholderProps, title, emptyLabel } = this.props;
        const listLabel = (components && (components.length > 0)) ? title : emptyLabel;

        return (
          <div className={ALLOWED_PLACEHOLDER_CLASS_NAMES + ' ' + placeholderProps.placeholderClassNames}>
            <div data-text={listLabel} className={ALLOWED_COMPONENT_TITLE_CLASS_NAMES} />
            {components.map((component, i) =>
              <AllowedComponentPlaceholder key={i} path={component.path} emptyLabel={component.title} />
            )}
          </div>
        );
    }
}
