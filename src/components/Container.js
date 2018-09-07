import React, { Component } from "react";
import PropTypes from 'prop-types';
import Constants from "../Constants";
import InternalUtils from "../InternalUtils";
import { ComponentMapping } from "../ComponentMapping";

const CONTAINER_CLASS_NAMES = "aem-container";
const PLACEHOLDER_CLASS_NAMES = Constants.NEW_SECTION_CLASS_NAMES;

/**
 * Placeholder of the Container component
 *
 * @class
 * @extends React.Component
 * @private
 */
export class ContainerPlaceholder extends Component {

    static get propTypes() {
        return {
            cqPath: PropTypes.string,
            placeholderClassNames: PropTypes.string
        };
    }

    render() {
        return <div data-cq-data-path={this.props.cqPath + "/*"} className={this.props.placeholderClassNames} />
    }
}

export class Container extends Component {

    constructor(props) {
        super(props);

        this.state = {
            componentMapping: this.props.componentMapping || ComponentMapping
        };
    }

    /**
     * Returns the child components of this Container.
     * It will iterate over all the items and instantiate the child components if a Mapping is found
     * Instantiation is done my connecting the Component with the data of that item
     *
     * @returns {Object[]} An array with the components instantiated to JSX
     */
    get childComponents() {
        let childComponents = [];

        if (!this.props.cqItems || !this.props.cqItemsOrder) {
            return childComponents;
        }

        this.props.cqItemsOrder.map((itemKey) => {
            let itemProps = InternalUtils.modelToProps(this.props.cqItems[itemKey]);

            if (itemProps) {
                let ItemComponent = this.state.componentMapping.get(itemProps.cqType);

                if (ItemComponent) {
                    childComponents.push(this.connectComponentWithItem(ItemComponent, itemProps, itemKey));
                }
            }
        });

        return childComponents;
    }

    /**
     * Connects a child component with the item data
     *
     * @param   {Component} ChildComponent the child component
     * @param   {Object} itemProps - the item data
     * @param   {String} itemKey - the name of the item in map
     * @returns {Object} - the React element constructed by connecting the values of the input with the Component
     */
    connectComponentWithItem(ChildComponent, itemProps, itemKey) {
        let itemPath = this.getItemPath(itemKey);
        return <div { ...this.getItemComponentProps(itemProps, itemKey, itemPath)}>
            <ChildComponent key={ itemPath } {...itemProps} cqPath={ itemPath }/>
        </div>
    }

    /**
     * Returns the properties to add on a specific child component
     *
     * @param   {Object} item     The item data
     * @param   {String} itemKey  The key of the item
     * @param   {String} itemPath The path of the item
     * @returns {Object} The map of properties to be added
     */
    getItemComponentProps(item, itemKey, itemPath) {
        let attrs =  {
            key: itemPath
        };

        if (!this.props.isInEditor || (item.hasOwnProperty("cqItems") && item.hasOwnProperty("cqItemsOrder"))) {
            return attrs;
        }

        attrs["data-cq-data-path"] = itemPath;

        return attrs;
    }

    /**
     * Computes the path of the current item
     *
     * @param   {String} itemKey - the key of the item 
     * @returns {String} - the computed path
     */
    getItemPath(itemKey) {
        return (this.props && this.props.cqPath) ? (this.props.cqPath + "/" + itemKey) : itemKey;
    }

    /**
     * The properties that will be injected in the root element of the container
     *
     * @returns {Object} - The map of properties to be added
     */
    get containerProps() {
        let attrs = {
            "className": CONTAINER_CLASS_NAMES
        };

        if (this.props.isInEditor) {
            attrs["data-cq-data-path"] = this.props.cqPath;
        }

        return attrs;
    }

    /**
     * The properties that will go on the placeholder component root element
     *
     * @returns {Object} - The map of properties to be added
     */
    get placeholderProps() {
        return {
            cqPath: this.props.cqPath,
            placeholderClassNames: PLACEHOLDER_CLASS_NAMES
        }
    }

    /**
     * The placeholder component that will be added in editing
     *
     * @returns {Object} React element to be instantiated as a placeholder
     */
    get placeholderComponent() {
        if (!this.props.isInEditor) {
            return;
        }

        return <ContainerPlaceholder { ...this.placeholderProps }/>
    }

    render() {
        return (
            <div {...this.containerProps}>
                { this.childComponents }
                { this.placeholderComponent }
            </div>
        )
    }
}