import NavBar from "../components/NavBar"
import SideMenu from "../components/SideMenu"
import DiagramBox from "../components/DiagramBox"




function SudanView() {
    return (
        <div className="main-container">
            <div className="top-container">
                <NavBar/>
            </div>

            <div className="bottom-container">
                <SideMenu />
                <DiagramBox countryName="sudan"/>
            </div>
        </div>
        
    );
}

export default SudanView