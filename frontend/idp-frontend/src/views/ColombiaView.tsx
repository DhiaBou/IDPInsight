import NavBar from "../components/NavBar"
import SideMenu from "../components/SideMenu"
import DiagramBox from "../components/DiagramBox"
import "../styles/DefaultView.css"

function ColombiaView() {
    return (
        <div className="main-container">
            <div className="top-container">
                <NavBar/>
            </div>

            <div className="bottom-container">
                <SideMenu />
                <DiagramBox countryName="colombia"/>
            </div>
        </div>
        
    );
}

export default ColombiaView