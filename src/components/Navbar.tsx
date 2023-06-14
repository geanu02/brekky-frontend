import ImgLogo from '../assets/images/logo.png'
import { Link } from 'react-router-dom'

export default function Navbar() {

    const logo = ImgLogo
    return (
        <nav className="z-10 fixed top-0 w-screen h-12 m-0
                        flex flex-row justify-center
                        bg-gray-800 text-white shadow-sm">
            <div>
                <Link to='/'>
                    <img src={logo} alt={`Brekky`} className="w-24"/>
                </Link>
            </div>
        </nav>
    )
}
