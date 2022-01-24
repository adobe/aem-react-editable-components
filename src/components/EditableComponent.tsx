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

import React, { Component, ComponentType } from 'react';
import isEqual from 'react-fast-compare';
import { MappedComponentProperties } from '../ComponentMapping';
import { Constants } from '../Constants';
import { ContainerState } from './Container';

/**
 * Configuration object of the withEditable function.
 *
 * @property emptyLabel - Label to be displayed on the overlay when the component is empty
 * @property isEmpty - Callback function to determine if the component is empty
 * @property resourceType - AEM ResourceType to be added as an attribute on the editable component dom
 */
export interface EditConfig<P extends MappedComponentProperties> {
  emptyLabel?: string;
  isEmpty(props: P): boolean;
  resourceType?: string;
}

export interface EditableComponentProperties<P extends MappedComponentProperties> {
  componentProperties: P;
  wrappedComponent: React.ComponentType<P>;
  editConfig: EditConfig<P>;
  containerProps?: { [key: string]: string };
}

type EditableComponentModel<P extends MappedComponentProperties> = EditableComponentProperties<P>;

/**
 * The EditableComponent provides components with editing capabilities.
 */
class EditableComponent<P extends MappedComponentProperties, S extends ContainerState> extends Component<
  EditableComponentModel<P>,
  S
> {
  constructor(props: EditableComponentModel<P>) {
    super(props);
    this.state = this.propsToState(props);
  }

  public propsToState(props: EditableComponentModel<P>): any {
    // Keep private properties from being passed as state
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const { wrappedComponent, containerProps, editConfig, ...state } = props;

    return state;
  }

  public componentDidUpdate(prevProps: EditableComponentModel<P>) {
    if (!isEqual(prevProps, this.props)) {
      this.setState(this.propsToState(this.props));
    }
  }

  /**
   * Properties related to the editing of the component.
   */
  get editProps(): { [key: string]: string } {
    const eProps: { [key: string]: string } = {};
    const componentProperties: P = this.props.componentProperties;

    if (!componentProperties.isInEditor) {
      return eProps;
    }

    eProps[Constants.DATA_PATH_ATTR] = componentProperties.cqPath;

    if (this.props.editConfig.resourceType) {
      eProps[Constants.DATA_CQ_RESOURCE_TYPE_ATTR] = this.props.editConfig.resourceType;
    }

    return eProps;
  }

  /**
   * Properties related to styling of the component.
   */
  get styleProps(): { [key: string]: string } {
    const sProps: { [key: string]: string } = { className: '' };
    const componentProperties: P = this.props.componentProperties;

    const appliedCssClassNames = componentProperties[Constants.APPLIED_CLASS_NAMES];

    if (appliedCssClassNames) sProps.className += appliedCssClassNames + ' ';

    if (this.props?.containerProps?.className) {
      sProps.className = sProps.className + ' ' + this.props.containerProps.className;
    }

    return sProps;
  }

  protected get emptyPlaceholderProps() {
    if (!this.useEmptyPlaceholder()) {
      return null;
    }

    return {
      className: Constants._PLACEHOLDER_CLASS_NAMES,
      'data-emptytext': this.props.editConfig.emptyLabel,
    };
  }

  /**
   * Should an empty placeholder be added.
   *
   * @return
   */
  public useEmptyPlaceholder() {
    return (
      this.props.componentProperties.isInEditor &&
      typeof this.props.editConfig.isEmpty === 'function' &&
      this.props.editConfig.isEmpty(this.props.componentProperties)
    );
  }

  public render() {
    const WrappedComponent: React.ComponentType<any> = this.props.wrappedComponent;

    const componentProperties: P = this.props.componentProperties;
    let renderScript;

    if (!componentProperties.isInEditor && componentProperties.aemNoDecoration) {
      renderScript = <WrappedComponent {...this.state} />;
    } else {
      renderScript = (
        <div {...this.editProps} {...{ ...this.props.containerProps, ...this.styleProps }}>
          <WrappedComponent {...this.state} />
          <div {...this.emptyPlaceholderProps} />
        </div>
      );
    }

    return renderScript;
  }
}

/**
 * Returns a component wrapper that provides editing capabilities to the component.
 *
 * @param WrappedComponent
 * @param editConfig
 */
export function withEditable<P extends MappedComponentProperties>(
  WrappedComponent: ComponentType<P>,
  editConfig?: EditConfig<P>,
) {
  const defaultEditConfig: EditConfig<P> = editConfig ? editConfig : { isEmpty: (props: P) => false };

  return class CompositeEditableComponent extends Component<P> {
    public render(): JSX.Element {
      type TypeToUse = EditableComponentProperties<P> & P;

      const computedProps: TypeToUse = {
        ...this.props,
        componentProperties: this.props,
        editConfig: defaultEditConfig,
        wrappedComponent: WrappedComponent,
      };

      return <EditableComponent {...computedProps} />;
    }
  };
}
