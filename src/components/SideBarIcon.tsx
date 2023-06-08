import { ReactNode } from "react"

interface Iconable {
    icon: ReactNode,
    tooltip: string
}

export default function SideBarIcon({ icon, tooltip = "tooltip" }: Iconable) {
    return (
        <div className="sidebar-icon group">
            {icon}
            <span className="sidebar-tooltip group-hover:scale-100">{tooltip}</span>
        </div>
    )
}