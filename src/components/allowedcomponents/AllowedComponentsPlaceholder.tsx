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

import PropTypes from 'prop-types';
import React, { Component } from 'react';

const ALLOWED_COMPONENT_PLACEHOLDER_CLASS_NAMES =
  'aem-AllowedComponent--component cq-placeholder placeholder';

export interface AllowedComponentPlaceHolderProperties {
  emptyLabel: string;
  path: string;
}

/**
 * Placeholder for one Allowed Component.
 */
export class AllowedComponentPlaceholder<
  P extends AllowedComponentPlaceHolderProperties,
  S
> extends Component<P, S> {
  public static get propTypes() {
    return {
      emptyLabel: PropTypes.string,
      path: PropTypes.string,
    };
  }

  public render() {
    const { path, emptyLabel } = this.props;

    return (
      <div
        data-cq-data-path={path}
        data-emptytext={emptyLabel}
        className={ALLOWED_COMPONENT_PLACEHOLDER_CLASS_NAMES}
      />
    );
  }
}
