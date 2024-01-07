import "../styles/DiagramBox.css"
import { CountryButtonProps } from "../utils/types";

function DiagramBox(props: CountryButtonProps) {
    if(props.countryName === 'sudan') {
        return (
        <div className="diagram-container">
            <iframe
                width="960"
                height="720"
            >
            </iframe>
        </div>
        );
    } else if(props.countryName === 'colombia') {
        return (
            <div className="diagram-container">
                <img src="/colombia.png" alt={props.countryName} />
            </div>
        );
    }
}

export default DiagramBox