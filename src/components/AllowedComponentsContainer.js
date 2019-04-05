import {Container} from "./Container";
import React, {Component} from "react";
import PropTypes from "prop-types";

const ALLOWED_PLACEHOLDER_CLASS_NAMES = 'aem-AllowedComponent--list';
const ALLOWED_COMPONENT_TITLE_CLASS_NAMES = 'aem-AllowedComponent--title';
const ALLOWED_COMPONENT_PLACEHOLDER_CLASS_NAMES = 'aem-AllowedComponent--component cq-placeholder placeholder';

/**
 * Placeholder for one Allowed Component
 */
export class AllowedComponentPlaceholder extends Component {

    static get propTypes() {
        return {
            emptyLabel: PropTypes.string,
            path: PropTypes.string
        };
    }

    render() {
        const { path, emptyLabel } = this.props;

        return <div data-cq-data-path={path} data-emptytext={emptyLabel} className={ALLOWED_COMPONENT_PLACEHOLDER_CLASS_NAMES} />;
    }
}

/**
 * List of placeholder of the Allowed Component Container component
 *
 * @class
 * @extends React.Component
 * @private
 */
export class AllowedComponentPlaceholderList extends Component {

    static get propTypes() {
        return {
            title: PropTypes.string,
            emptyLabel: PropTypes.string,
            components: PropTypes.arrayOf(PropTypes.shape({
                path: PropTypes.string,
                title: PropTypes.string
            })),
            placeholderClassNames: PropTypes.string,
            cqPath: PropTypes.string
        };
    }

    render() {
        const { components, placeholderClassNames, title, emptyLabel } = this.props;
        const listLabel = components && components.length > 0 ? title : emptyLabel;

        return <div className={ALLOWED_PLACEHOLDER_CLASS_NAMES + ' ' + placeholderClassNames}>
                    <div data-text={listLabel} className={ALLOWED_COMPONENT_TITLE_CLASS_NAMES}/>
                    {components.map((component, i) =>
                        <AllowedComponentPlaceholder key={i}
                                                     path={component.path}
                                                     emptyLabel={component.title}/>
                    )}
                </div>
    }
}

/**
 *  When applicable, the component exposes a list of allowed components
 */
export class AllowedComponentsContainer extends Container {

    render() {
        const { allowedComponents, _allowedComponentPlaceholderListEmptyLabel, title, isInEditor } = this.props;

        if (isInEditor && allowedComponents && allowedComponents.applicable) {
            return <AllowedComponentPlaceholderList title={title}
                                                    emptyLabel={_allowedComponentPlaceholderListEmptyLabel}
                                                    components={allowedComponents.components}
                                                    { ...this.placeholderProps }/>
        }

        return super.render();
    }
}

AllowedComponentsContainer.defaultProps = {
    // Temporary property until CQ-4265892 is addressed, beware not rely it
    _allowedComponentPlaceholderListEmptyLabel: 'No allowed components'
};