import "./ExternalLink.css";

const ExternalLink = (props) => {
    if (!props.children) {
        return "-"
    }

    return <><a target="_blank" rel="noopener noreferrer" {...props} className="ExternalLink">
        {props.children}
    </a> <sup title="External link">🡥</sup></>
}

export default ExternalLink;
