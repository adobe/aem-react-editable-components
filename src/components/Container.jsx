import React, { Component } from 'react';
import ModelConstants from '../ModelConstants';
import { ComponentMapping } from '../ComponentMapping';
import CQModelProvider from "../ModelProvider";

class Container extends Component {

    /**
     * Wrapper class in which the content is eventually wrapped
     *
     * @returns {ModelProvider}
     */
    get wrapper() {
        return CQModelProvider;
    }

    /**
     * Returns the path of the current resource
     *
     * @returns {string|boolean}
     */
    get path() {
        return this.props && this.props.cq_model && this.props.cq_model.path;
    }

    get innerContent() {
        let that = this;
        let containerPath = this.path || this.props.path || '';

        // Prepare container path for concatenation
        if ('/' === containerPath) {
            containerPath = '';
        }

        containerPath = containerPath.length > 0 ? containerPath + '/' : containerPath;

        return this.props.cq_model && this.props.cq_model[ModelConstants.ITEMS_ORDER_PROP].map(itemKey => {
            const item = that.props.cq_model[ModelConstants.ITEMS_PROP][itemKey];
            item.path = containerPath + itemKey;

            // console.debug("Container.js", "add item", item.path, item, that);
            const type = item[ModelConstants.TYPE_PROP];

            if (!type) {
                // console.debug("Container.js", "no type", item, that);
                return false;
            }

            // Get the constructor of the component to later be dynamically instantiated
            const DynamicComponent = ComponentMapping.get(type);

            if (!DynamicComponent) {
                // console.debug("Container.js", "no dynamic component", item, that);
                return false;
            }

            let Wrapper = this.wrapper;

            if (Wrapper) {
                return <Wrapper key={item.path} path={item.path}><DynamicComponent cq_model={item}/></Wrapper>
            }

            return <DynamicComponent cq_model={item}/>;
        });
    }

    render() {
        return <div>{this.innerContent}</div>;
    }
}

export default Container;