import "../styles/DiagramBox.css"
import { CountryButtonProps } from "../utils/types";

function DiagramBox(props: CountryButtonProps) {
    if(props.countryName === 'sudan') {
        return (
            <div className="diagram-container">
                <div className="image-container">
                    <img className="image" src="/sudan_1.png" alt={props.countryName} />
                </div>
                <div className="image-container">
                    <img className="image" src="/sudan_2.png" alt={props.countryName} />
                </div>
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