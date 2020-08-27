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
import Utils from '../Utils';
import { Container, ContainerProperties, ContainerState } from './Container';
import { ComponentMapping } from "../ComponentMapping";

const NN_JCR_CONTENT = 'jcr:content';
const PAGE_CLASS_NAMES = 'aem-page';

export interface PageModel extends Model {
    ':type': string;
    'id': string;
    ':path': string;
    ':children'?: { [key: string]: PageModel };
}

export interface PageProperties extends ContainerProperties {
    cqChildren: { [key: string]: PageModel };
}
/**
 * The container for a Page.
 * In editing we need to force that this doesn't render a placeholder.
 * It should add data-cq-page-path instead fo data-cq-data-path.
 */
export class Page<P extends PageProperties, S extends ContainerState> extends Container<P, S> {
    public static defaultProps = {
        cqChildren: {},
        cqItems: {},
        cqItemsOrder: [],
        cqPath: ''
    };

    constructor(props: P) {
        super(props);

        // @ts-ignore
        this.state = {
            componentMapping: this.props.componentMapping || ComponentMapping
        };
    }

    /**
     * The attributes that will be injected in the root element of the container
     *
     * @returns {Object} - the attributes of the container
     */
    get containerProps(): { [key: string]: string } {
        const attrs: { [key: string]: string } = {
            className: PAGE_CLASS_NAMES
        };

        if (!this.props.isInEditor) {
            return attrs;
        }

        attrs[Constants.DATA_PATH_ATTR] = this.props.cqPath;

        return attrs;
    }

    /**
     * Returns the child pages of a page
     *
     * @return {Array}
     */
    get childPages() {
        const pages: JSX.Element[] = [];

        if (!this.props.cqChildren) {
            return pages;
        }

        Object.keys(this.props.cqChildren).map((itemKey) => {
            const itemProps = Utils.modelToProps(this.props.cqChildren[itemKey]);

            const ItemComponent = this.state.componentMapping.get(itemProps.cqType);

            if (ItemComponent) {
                pages.push(
                    <ItemComponent key={ itemProps.cqPath } {...itemProps} cqPath={ itemProps.cqPath }>
                    </ItemComponent>
                );
            }
        });

        return pages;
    }

    /**
     * Computes the path of the current item.
     *
     * @param {String} itemKey - the key of the item
     * @returns {String} - the computed path
     */
    public getItemPath(itemKey: string) {
        return (this.props && this.props.cqPath) ? (this.props.cqPath + '/' + NN_JCR_CONTENT + '/' + itemKey) : itemKey;
    }

    public render() {
        return (
            <div {...this.containerProps}>
                { this.childComponents }
                { this.childPages }
            </div>
        );
    }
}
