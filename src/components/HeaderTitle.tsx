type HeaderTitle = {
    break?: boolean,
    h2Style?: string,
    spanStyle?: string,
    unColoredText?: string,
    coloredText: string
}

export default function HeaderTitle(props: HeaderTitle) {

  const defaultH2Style: string = "mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl"
  const defaultSpanStyle: string = "text-transparent bg-clip-text bg-gradient-to-r to-sky-200 from-sky-400"

  return (
    <>
        <h2 className={ props.h2Style ? props.h2Style : defaultH2Style }>
                { props.unColoredText }
                { props.break ? <br /> : '' }
            <span className={ props.spanStyle ? props.spanStyle : defaultSpanStyle}>
                { props.coloredText }
            </span>
        </h2>
    </>
  )
}
