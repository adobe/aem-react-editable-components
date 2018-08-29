import { Container } from './Container';
import { MapTo } from '../ComponentMapping';

const PLACEHOLDER_CLASS_NAMES = 'aem-Grid-newComponent';

export class ResponsiveGrid extends Container {

    /**
     * The attributes that will be injected in the root element of the container
     *
     * @returns {Object} - the attributes of the container
     */
    get containerProps() {
        let containerProps = super.containerProps;
        containerProps.className = (containerProps.className || '') + ' ' +  this.props.gridClassNames;
        return containerProps;
    }

    /**
     * The properties that will go on the placeholder component root element
     *
     * @returns {Object} - the properties as a map
     */
    get placeholderProps() {
        let props = super.placeholderProps;
        props.placeholderClassNames = (props.placeholderClassNames || '') + ' ' +  PLACEHOLDER_CLASS_NAMES;
        return props;
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
        let attrs = super.getItemComponentProps(item, itemKey, itemPath);
        attrs.className = this.props.columnClassNames[itemKey];

        if (!this.props.isInEditor || (item.hasOwnProperty('cqItems') && item.hasOwnProperty('cqItemsOrder'))) {
            return attrs;
        }

        attrs['data-cq-data-path'] = itemPath;

        return attrs;
    }
}

MapTo('wcm/foundation/components/responsivegrid')(ResponsiveGrid);