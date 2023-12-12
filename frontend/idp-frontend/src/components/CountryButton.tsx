import {CountryButtonProps} from '../utils/types'
import "../styles/CountryButton.css"
import { Link } from 'react-router-dom';



function CountryButton(props: CountryButtonProps) {
    return (
            <div className='button-container'>
                    <button className='button'>
                        <Link to={`/${props.countryName}`} className='white-link'>
                            {props.countryName}
                        </Link>
                    </button>
            </div>
        
    );
}

export default CountryButton