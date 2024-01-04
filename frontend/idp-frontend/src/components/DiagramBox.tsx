import "../styles/DiagramBox.css"
import { CountryButtonProps } from "../utils/types";

function DiagramBox(props: CountryButtonProps) {
    if(props.countryName === 'sudan') {
        return (
        <div className="diagram-container">
            <iframe
                width="960"
                height="720"
                src="https://eu-west-1.quicksight.aws.amazon.com/sn/embed/share/accounts/122662047093/dashboards/c192f767-b772-4fe3-a63a-2f418e85c780?directory_alias=nl-wfp">
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