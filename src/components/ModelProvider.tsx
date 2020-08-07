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

import { Model, ModelManager } from '@adobe/cq-spa-page-model-manager';
import React, { Component } from 'react';
import isEqual from 'react-fast-compare';
import { ReloadForceAble } from '../ComponentMapping';
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
export const withModel = (WrappedComponent: React.ComponentType<any>, modelConfig?: ReloadableModelProperties) => {
    /**
     * @type CompositeModelProvider
     */
    return class CompositeModelProviderImpl extends Component<ReloadForceAble> {
        public render() {
            const modelConfigToUse: ReloadableModelProperties = modelConfig || { forceReload: false };

            // The reload can be forced either via the withModel function property or locally via the tag's property
            const forceReload = this.props.cqForceReload || modelConfigToUse.forceReload;

            return <ModelProvider { ...this.props } cqForceReload={forceReload} wrappedComponent={ WrappedComponent } />;
        }
    };
};
