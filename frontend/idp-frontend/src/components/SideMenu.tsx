import "../styles/SideMenu.css"
import CountryButton from "./CountryButton";
import { SideMenuProps } from "../utils/types";

function SideMenu(props: SideMenuProps) {
    const countries = props.countryNames

    const countryButtons = countries.map(country =>
        <CountryButton countryName={country.name} key={country.name} />
        );

    return (
        <div className='side-menu-container'>
            {countryButtons}
        </div>
    );
}

export default SideMenu