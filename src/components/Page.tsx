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

import React from 'react';
import { Model } from '@adobe/cq-spa-page-model-manager';
import Constants from '../Constants';
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
