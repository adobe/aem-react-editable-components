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

import { Model, ModelManager } from '@adobe/aem-spa-page-model-manager';
import React, { Component } from 'react';
import { ComponentMapping, MappedComponentProperties } from '../ComponentMapping';
import { Constants } from '../Constants';
import Utils from '../Utils';
import { ContainerPlaceholder, PlaceHolderModel } from './ContainerPlaceholder';

export interface ContainerProperties extends MappedComponentProperties {
    componentMapping?: typeof ComponentMapping;
    cqItems: { [key: string]: Model };
    cqItemsOrder: string[];
}

export interface ContainerState {
    componentMapping: typeof ComponentMapping;
}

export class Container<P extends ContainerProperties, S extends ContainerState> extends Component<P, S> {
    public static defaultProps = {
        cqItems: {},
        cqItemsOrder: [],
        cqPath: ''
    };

    constructor(props: P) {
        super(props);

        this.state = {
            componentMapping: this.props.componentMapping || ComponentMapping
        } as Readonly<S>;
    }

    /**
     * Returns the child components of this Container.
     * It will instantiate the child components if mapping exists.
     *
     * @returns An array with the components instantiated to JSX
     */
    get childComponents(): JSX.Element[] {
        const childComponents: JSX.Element[] = [];

        if (!this.props.cqItems || !this.props.cqItemsOrder) {
            return childComponents;
        }

        this.props.cqItemsOrder.map((itemKey) => {
            const itemProps = Utils.modelToProps(this.props.cqItems[itemKey]);

            if (itemProps) {
                const ItemComponent: React.ComponentType<MappedComponentProperties> = this.state.componentMapping.get(itemProps.cqType);

                if (ItemComponent) {
                    childComponents.push(this.connectComponentWithItem(ItemComponent, itemProps, itemKey));
                }
            }
        });

        return childComponents;
    }

    /**
     * Connects a child component with the item data.
     *
     * @param ChildComponent
     * @param itemProps
     * @param itemKey
     * @returns The React element constructed by connecting the values of the input with the Component.
     */
    protected connectComponentWithItem(ChildComponent: React.ComponentType<MappedComponentProperties>, itemProps: any, itemKey: string) {
        const itemPath = this.getItemPath(itemKey);

        return <ChildComponent {...itemProps}
                               key={itemPath}
                               cqPath={itemPath}
                               isInEditor={this.props.isInEditor}
                               containerProps={this.getItemComponentProps(itemProps, itemKey, itemPath)}/>;
    }

    /**
     * Returns the properties to add on a specific child component.
     *
     * @param item
     * @param itemKey
     * @param itemPath
     * @returns The map of properties.
     */
    /* eslint-disable @typescript-eslint/no-unused-vars */
    getItemComponentProps(item: any, itemKey: string, itemPath: string): { [key: string]: string } {
        return {};
    }

    /**
     * Returns the path of given item.
     *
     * @param itemKey
     * @returns The computed path.
     */
    public getItemPath(itemKey: string): string {
        return (this.props && this.props.cqPath) ? (this.props.cqPath + '/' + itemKey) : itemKey;
    }

    /**
     * The properties for the root element of the container.
     *
     * @returns The map of properties.
     */
    get containerProps(): {[key: string]: string} {
        const props: { [key: string]: string } = {
            className: Constants._CONTAINER_CLASS_NAMES
        };

        if (this.props.isInEditor) {
            props[Constants.DATA_PATH_ATTR] = this.props.cqPath;
        }

        return props;
    }

    /**
     * The properties for the placeholder component in root element.
     *
     * @returns The map of properties to be added.
     */
    get placeholderProps(): PlaceHolderModel {
        return {
            cqPath: this.props.cqPath,
            placeholderClassNames: Constants.NEW_SECTION_CLASS_NAMES
        };
    }

    get placeholderComponent(): JSX.Element | null {
        if (!this.props.isInEditor) {
            return null;
        }

        return <ContainerPlaceholder { ...this.placeholderProps }/>;
    }

    // eslint-disable-next-line max-lines-per-function
    public render(): JSX.Element {
        let renderScript;

        if (!this.props.isInEditor && this.props.aemNoDecoration){
            renderScript = (
              <React.Fragment>
                { this.childComponents }
              </React.Fragment>
            );
        } else {
            const ref = React.createRef<HTMLDivElement>();

            if (this.props.isInEditor) {
                // indicate container as virtual in case model manager returns no details
                ModelManager.getData({ path: this.props.cqPath })
                    .then((data) => {
                        const isVirtualContainer = Object.keys(data || {}).length === 0;

                        if (isVirtualContainer && ref?.current) {
                            ref.current.setAttribute("data-cq-virtualcontainer", "true");
                        }
                    });
            }

            renderScript = (
              <div {...this.containerProps} ref={ref}>
                { this.childComponents }
                { this.placeholderComponent }
              </div>
            );
        }

        return renderScript;
    }
}
