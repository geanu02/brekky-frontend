import { BrekkyContext } from "../contexts/BrekkyProvider";
import { ReactNode, useContext, useEffect } from "react";
import { 
    RiHomeHeartFill, 
    RiFileSearchFill, 
    RiFileUserFill, 
    RiContactsFill,
    RiLoginBoxFill, 
    RiLogoutBoxRFill } from "react-icons/ri";
import { NavLink } from "react-router-dom";

export default function Sidebar() {

    const { user, setUser } = useContext(BrekkyContext)

    useEffect(() => {
        if (user.token) { 
            localStorage.setItem('token', JSON.stringify(user.token))
            localStorage.setItem('firstname', JSON.stringify(user.firstname))
            localStorage.setItem('username', JSON.stringify(user.username))
        }
        if (user.token || localStorage.getItem('token')) {
            const storedToken = localStorage.getItem('token')
            const storedUserName = localStorage.getItem('username')
            const storedFirstName = localStorage.getItem('firstname')

            if (storedToken && storedFirstName && storedUserName && !user.token) {
                setUser({
                    loggedIn: true, 
                    token: storedToken.replaceAll('"', ""), 
                    firstname: storedFirstName.replaceAll('"', ""), 
                    username: storedUserName.replaceAll('"', "")
                })
            }
        }
    },[user])

    return (
        <div className="z-10 fixed z-100 top-12 left-0 h-screen w-16 m-0
                        flex flex-col bg-gray-900 text-white shadow-lg">
            <NavLink to='/'>
                <SideBarIcon icon={ <RiHomeHeartFill size="32" /> } tooltip={`Home`} />
            </NavLink>
            <NavLink to='/search'>
                <SideBarIcon icon={ <RiFileSearchFill size="32" /> } tooltip={`Search Recipe`}/>
            </NavLink>
            {
                user.token
                ? (
                    <>
                        <NavLink to='/myrecipes'>
                            <SideBarIcon icon={ <RiFileUserFill size="32" /> } tooltip={`${user.firstname}'s Recipes`}/>
                        </NavLink>
                        <NavLink to='/logout'>
                            <SideBarIcon icon={ <RiLogoutBoxRFill size="32" /> } tooltip={`Logout`}/>
                        </NavLink>
                    </>
                ) : (
                    <>
                        <NavLink to='/register'>
                            <SideBarIcon icon={ <RiContactsFill size="32" /> } tooltip={`Register`}/>
                        </NavLink>
                        <NavLink to='/login'>
                            <SideBarIcon icon={ <RiLoginBoxFill size="32" /> } tooltip={`Login`}/>
                        </NavLink>
                    </>
                )
            }
        </div>
    )
}

interface Iconable {
    icon: ReactNode,
    tooltip: string
}

const SideBarIcon = ({ icon, tooltip = "tooltip" }: Iconable) => {
    return (
        <div className="sidebar-icon group">
            {icon}
            <span className="sidebar-tooltip group-hover:scale-100">{tooltip}</span>
        </div>
    )
}