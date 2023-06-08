interface CuteButtonable {
    eventHandler?: React.MouseEventHandler,
    buttonDisplayName: string
}

export default function CuteButton({ eventHandler, buttonDisplayName }: CuteButtonable) {

    return (
        <button onClick={eventHandler} 
                className="bg-gray-800 text-lg font-medium text-sky-600 border-2
                            border-gray-800 px-12 py-2 rounded-full
                            hover:text-white group relative flex items-center
                            overflow-hidden">
            <span className="absolute left-0 w-full h-0 transition-all
                            bg-sky-600 opacity-100 group-hover:h-full
                            group-hover:top-0 duration-400 ease"></span>
            <span className="relative">{buttonDisplayName}</span>
        </button>
    )
}

