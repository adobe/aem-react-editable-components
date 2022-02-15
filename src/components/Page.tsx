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
import { Model } from '@adobe/aem-spa-page-model-manager';
import { Constants } from '../Constants';
import Utils from '../utils/Utils';
import { Container, ContainerProperties, ContainerState } from './Container';
import { ComponentMapping, MappedComponentProperties } from '../core/ComponentMapping';

export interface PageModel extends Model {
  ':type': string;
  id: string;
  ':path': string;
  ':children'?: { [key: string]: PageModel };
}

export interface PageProperties extends ContainerProperties {
  cqChildren: { [key: string]: PageModel };
}

export class Page<P extends PageProperties, S extends ContainerState> extends Container<P, S> {
  public static defaultProps = {
    cqChildren: {},
    cqItems: {},
    cqItemsOrder: [],
    cqPath: '',
  };

  constructor(props: P) {
    super(props);

    this.state = {
      componentMapping: this.props.componentMapping || ComponentMapping,
    } as Readonly<S>;
  }

  get containerProps(): { [key: string]: string } {
    const props: { [key: string]: string } = {
      className: Constants._PAGE_CLASS_NAMES,
    };

    if (this.props.isInEditor) {
      props[Constants.DATA_PATH_ATTR] = this.props.cqPath;
    }

    return props;
  }

  /**
   * @returns The child pages of a page.
   */
  get childPages(): JSX.Element[] {
    const pages: JSX.Element[] = [];

    if (!this.props.cqChildren) {
      return pages;
    }

    Object.keys(this.props.cqChildren).map((itemKey) => {
      const itemProps = Utils.modelToProps(this.props.cqChildren[itemKey]);
      const ItemComponent: React.ComponentType<MappedComponentProperties> = this.state.componentMapping.get(
        itemProps.cqType,
      );

      if (ItemComponent) {
        pages.push(<ItemComponent key={itemProps.cqPath} {...itemProps} cqPath={itemProps.cqPath}></ItemComponent>);
      }
    });

    return pages;
  }

  public getItemPath(itemKey: string) {
    return this.props && this.props.cqPath ? this.props.cqPath + '/' + Constants.JCR_CONTENT + '/' + itemKey : itemKey;
  }

  public render() {
    return (
      <div {...this.containerProps}>
        {this.childComponents}
        {this.childPages}
      </div>
    );
  }
}
