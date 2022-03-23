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

import { Model, ModelManager, PathUtils } from '@adobe/aem-spa-page-model-manager';
import React, { Component } from 'react';
import isEqual from 'react-fast-compare';
import { Constants } from '../Constants';
import { MappedComponentProperties, ReloadForceAble } from './ComponentMapping';
import Utils from '../utils/Utils';
import { useEditor } from '../hooks/useEditor';

/**
 * Configuration object of the withModel function.
 */
export interface ReloadableModelProperties {
  /*
   * Should the model cache be ignored when processing the component.
   */
  forceReload?: boolean;
  /**
   * Should the component data be retrieved from the aem page model
   * and passed down as props on componentMount
   */
  injectPropsOnInit?: boolean;
}

/*
 * @private
 */
export interface ModelProviderType extends ReloadForceAble {
  wrappedComponent: React.ComponentType<any>;
  cqPath: string;
  injectPropsOnInit?: boolean;
  pagePath?: string;
  itemPath?: string;
}

/**
 * Wraps a portion of the page model into a Component.
 * Fetches content from AEM (using ModelManager) and inject it into the passed React Component.
 *
 * @private
 */
export class ModelProvider extends Component<ModelProviderType> {
  constructor(props: ModelProviderType) {
    super(props);
    this.updateData = this.updateData.bind(this);
    this.state = this.propsToState(props);
  }

  public propsToState(props: ModelProviderType): Partial<ModelProviderType> {
    const state = { ...props } as Partial<ModelProviderType>;

    delete state.wrappedComponent;
    delete state.cqForceReload;
    delete state.injectPropsOnInit;

    return state;
  }

  public componentDidUpdate(prevProps: ModelProviderType): void {
    if (!isEqual(prevProps, this.props)) {
      this.setState(this.propsToState(this.props));
    }
  }

  /**
   * Update model based on given resource path.
   * @param cqPath resource path
   */
  public updateData(cqPath?: string): void {
    const { pagePath, itemPath, injectPropsOnInit } = this.props;
    const path =
      cqPath || this.props.cqPath || (pagePath && Utils.getCQPath({ pagePath, itemPath, injectPropsOnInit }));

    if (!path) {
      return;
    }

    ModelManager.getData({ path, forceReload: this.props.cqForceReload })
      .then((data: Model) => {
        if (data && Object.keys(data).length > 0) {
          const props = Utils.modelToProps(data);
          const isInEditor = useEditor();

          this.setState(props);
          // Fire event once component model has been fetched and rendered to enable editing on AEM
          if (injectPropsOnInit && isInEditor) {
            PathUtils.dispatchGlobalCustomEvent(Constants.ASYNC_CONTENT_LOADED_EVENT, {});
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  public componentDidMount(): void {
    const { pagePath, itemPath, injectPropsOnInit } = this.props;
    let { cqPath } = this.props;

    cqPath = Utils.getCQPath({ pagePath, itemPath, injectPropsOnInit, cqPath });
    this.setState({ cqPath });

    if (this.props.injectPropsOnInit) {
      this.updateData(cqPath);
    }
    ModelManager.addListener(cqPath, this.updateData);
  }

  public componentWillUnmount(): void {
    ModelManager.removeListener(this.props.cqPath, this.updateData);
  }

  public render(): JSX.Element {
    const WrappedComponent = this.props.wrappedComponent;
    return <WrappedComponent {...this.state} />;
  }
}

/**
 * @param WrappedComponent React representation for the AEM resource types.
 * @param modelConfig General configuration object.
 */
export const withModel = <P extends MappedComponentProperties>(
  WrappedComponent: React.ComponentType<P>,
  modelConfig: ReloadableModelProperties = {},
) => {
  return class CompositeModelProviderImpl extends Component<P> {
    public render() {
      const forceReload = this.props.cqForceReload || modelConfig.forceReload || false;
      const injectPropsOnInit = modelConfig.injectPropsOnInit || false;

      return (
        <ModelProvider
          {...this.props}
          cqForceReload={forceReload}
          injectPropsOnInit={injectPropsOnInit}
          wrappedComponent={WrappedComponent}
        />
      );
    }
  };
};
