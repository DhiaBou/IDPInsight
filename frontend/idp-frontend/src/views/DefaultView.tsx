import NavBar from "../components/NavBar"
import SideMenu from "../components/SideMenu"
import DiagramBox from "../components/DiagramBox"
import { SideMenuProps } from "../utils/types";



function DefaultView(props: SideMenuProps) {
    return (
        <div className="main-container">
            <div className="top-container">
                <NavBar/>
            </div>

            <div className="bottom-container">
                <SideMenu countryNames={props.countryNames}/>
                <DiagramBox countryName="sudan"/>
            </div>
        </div>
        
    );
}


export default DefaultView