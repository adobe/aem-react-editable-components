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

import { normalize as normalizePath } from 'path';
import { Model, ModelManager } from '@adobe/aem-spa-page-model-manager';
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
    forceReload?: boolean;
    /**
     * Should the component data be retrieved from the aem page model
     * and passed down as props on componentMount
     */
    injectPropsOnInit?: boolean;
}

export interface ModelProviderType extends ReloadForceAble {
    wrappedComponent: React.ComponentType<any>;
    cqPath?: string;
    injectPropsOnInit?: boolean;
    pagePath?: string;
    itemPath?: string;
}

/**
 * Wraps a portion of the page model into a Component.
 * Fetches content from AEM (using ModelManager) and inject it into the passed React Component.
 */
export class ModelProvider extends Component<ModelProviderType> {
    constructor(props: ModelProviderType) {
        super(props);
        this.getCQPath = this.getCQPath.bind(this);
        this.updateData = this.updateData.bind(this);

        this.state = this.propsToState(props);
    }

    public propsToState(props: ModelProviderType) {
        // Keep private properties from being passed as state
        const { wrappedComponent, cqForceReload, injectPropsOnInit, ...state } = props;

        return state;
    }

    public componentDidUpdate(prevProps: ModelProviderType) {
        if (!isEqual(prevProps, this.props)) {
            this.setState(this.propsToState(this.props));
        }
    }

    public updateData(cqPath?: string) {
        const path = cqPath || this.props.cqPath;
        if (path) {
            ModelManager.getData({ path, forceReload: this.props.cqForceReload}).then((data: Model) => {
              if (data && (Object.keys(data).length > 0)) {
                  const props = Utils.modelToProps(data);
                  this.setState(props);
              }
          });
        }
    }

    private getCQPath(): string {
        const {
            pagePath = '', itemPath = '', injectPropsOnInit
        } = this.props;
        let { cqPath = '' } = this.props;

        if (injectPropsOnInit && !cqPath) {
            cqPath = (
                itemPath ?
                `${pagePath}/jcr:content/${itemPath}` :
                pagePath
            );

            // Normalize path (replace multiple consecutive slashes with a single one).
            cqPath = normalizePath(cqPath);
            this.setState({ cqPath });
        }
        return cqPath;
    }

    public componentDidMount() {
        const cqPath = this.getCQPath();
        if (this.props.injectPropsOnInit) {
          this.updateData(cqPath);
        }
        ModelManager.addListener(cqPath, this.updateData);
    }

    public componentWillUnmount() {
        const cqPath = this.getCQPath();
        // Clean up listener
        ModelManager.removeListener(cqPath, this.updateData);
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
            const modelConfigToUse: ReloadableModelProperties = modelConfig || {};

            // The reload can be forced either via the withModel function property or locally via the tag's property
            const forceReload = this.props.cqForceReload || modelConfigToUse.forceReload || false;

            const injectPropsOnInit = modelConfigToUse.injectPropsOnInit || false;

            return (
              <ModelProvider
                { ...this.props }
                cqForceReload={forceReload}
                injectPropsOnInit={injectPropsOnInit}
                wrappedComponent={ WrappedComponent } />
            );
        }
    };
};
