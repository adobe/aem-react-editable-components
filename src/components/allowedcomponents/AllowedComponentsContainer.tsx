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
 * Component that is allowed to be used on the page by the editor
 */
export interface AllowedComponent {
  /**
   * Path to the component under apps
   */
  path: string;

  /**
   * Title of the component
   */
  title: string;
}

/**
 * AllowedComponents collection
 */
export interface AllowedComponents {
  applicable: boolean;

  /**
   * List of allowed components
   */
  components: AllowedComponent[];
}

/**
 * Properties for the allowed components container
 */
export interface AllowedComponentsProperties extends ContainerProperties {
  /**
   * List of allowed components for the container
   */
  allowedComponents: AllowedComponents;

  /**
   *  Label to display when there are no allowed components
   */
  _allowedComponentPlaceholderListEmptyLabel?: string;

  /**
   * Title of the placeholder list
   */
  title: string;
}

/**
 *  When applicable, the component exposes a list of allowed components
 *  This is used by the template editor
 */
export class AllowedComponentsContainer<
  M extends AllowedComponentsProperties,
  S extends ContainerState
> extends Container<M, S> {
  public static defaultProps = {
    // Temporary property until CQ-4265892 is addressed, beware not rely it
    _allowedComponentPlaceholderListEmptyLabel: 'No allowed components',
    cqItems: {},
    cqItemsOrder: [],
    cqPath: '',
  };

  public render() {
    const {
      allowedComponents,
      _allowedComponentPlaceholderListEmptyLabel,
      title,
      isInEditor,
    } = this.props;

    if (isInEditor && allowedComponents && allowedComponents.applicable) {
      // @ts-ignore
      const emptyLabel: string = _allowedComponentPlaceholderListEmptyLabel
        ? _allowedComponentPlaceholderListEmptyLabel
        : AllowedComponentsContainer.defaultProps
            ._allowedComponentPlaceholderListEmptyLabel;

      if (_allowedComponentPlaceholderListEmptyLabel) {
        // @ts-ignore
        return (
          <AllowedComponentPlaceholderList
            title={title}
            emptyLabel={emptyLabel}
            components={allowedComponents.components}
            placeholderProps={this.placeholderProps}
            cqPath={this.props.cqPath}
          />
        );
      }
    }

    return super.render();
  }
}
