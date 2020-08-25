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
