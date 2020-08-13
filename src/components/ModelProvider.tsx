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

import { Model, ModelManager } from '@adobe/cq-spa-page-model-manager';
import React, { Component } from 'react';
import isEqual from 'react-fast-compare';
import { ReloadForceAble, MappedComponentProperties } from '../ComponentMapping';
import Utils from '../Utils';

/**
 * Configuration object of the withModel function.
 */
export interface ReloadableModelProperties {
    /**
     * Should the model be refreshed all the time
     */
    forceReload: boolean;
}

interface ModelProviderType extends ReloadForceAble {
    wrappedComponent: React.ComponentType<any>;
    cqPath?: string;
}

/**
 * Wraps a portion of the page model into a Component.
 * Fetches content from AEM (using ModelManager) and inject it into the passed React Component.
 */
export class ModelProvider extends Component<ModelProviderType, any> {
    constructor(props: ModelProviderType) {
        super(props);
        this.state = this.propsToState(props);
    }

    public propsToState(props: ModelProviderType) {
        // Keep private properties from being passed as state
        const { wrappedComponent, cqForceReload, ...state } = props;

        return state;
    }

    public componentDidUpdate(prevProps: ModelProviderType) {
        if (!isEqual(prevProps, this.props)) {
            this.setState(this.propsToState(this.props));
        }
    }

    public updateData() {
        ModelManager.getData({path: this.props.cqPath, forceReload: this.props.cqForceReload}).then((data: Model) => {
            this.setState(Utils.modelToProps(data));
        });
    }

    public componentDidMount() {
        ModelManager.addListener(this.props.cqPath, this.updateData.bind(this));
    }

    public componentWillUnmount() {
        // Clean up listener
        ModelManager.removeListener(this.props.cqPath, this.updateData.bind(this));
    }

    public render() {
        const WrappedComponent = this.props.wrappedComponent;

        return <WrappedComponent {...this.state}/>;
    }
}

/**
 * @param WrappedComponent
 * @param {ReloadableModelProperties} [modelConfig]
 */
export const withModel = <P extends MappedComponentProperties>(WrappedComponent: React.ComponentType<P>, modelConfig?: ReloadableModelProperties) => {
    /**
     * @type CompositeModelProvider
     */
    return class CompositeModelProviderImpl extends Component<P> {
        public render() {
            const modelConfigToUse: ReloadableModelProperties = modelConfig || { forceReload: false };

            // The reload can be forced either via the withModel function property or locally via the tag's property
            const forceReload = this.props.cqForceReload || modelConfigToUse.forceReload;

            return <ModelProvider { ...this.props } cqForceReload={forceReload} wrappedComponent={ WrappedComponent } />;
        }
    };
};
