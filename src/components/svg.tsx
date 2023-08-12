
export function CheckboxSVG(props: React.SVGProps<SVGSVGElement> & { checked: boolean }) {
  //MdiCheckboxBlankOutline
  if (props.checked) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        { ...props }>
        <path
          d="M19 3H5C4.46957 3 3.96086 3.21071 3.58579 3.58579C3.21071 3.96086 3 4.46957 3 5V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H19C19.5304 21 20.0391 20.7893 20.4142 20.4142C20.7893 20.0391 21 19.5304 21 19V5C21 4.46957 20.7893 3.96086 20.4142 3.58579C20.0391 3.21071 19.5304 3 19 3Z"
          fill="#3B82F6"
        />
        <path
          d="M5 12L10 17L19 8L17.59 6.58L10 14.17L6.41 10.59L5 12Z"
          fill="white"
        />
      </svg>
    )
  } else {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        { ...props }
      >
        <path fill="currentColor" d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"></path>
      </svg>
    )
  }
}



export function FileDownload(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" { ...props }><path fill="currentColor" d="m12 17l4-4l-1.4-1.4l-1.6 1.55V9h-2v4.15L9.4 11.6L8 13l4 4Zm-6 5q-.825 0-1.413-.588T4 20V8l6-6h8q.825 0 1.413.588T20 4v16q0 .825-.588 1.413T18 22H6Zm0-2h12V4h-7.15L6 8.85V20Zm0 0h12H6Z"></path></svg>
  )
}


export function DatabasePageIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" { ...props }><path fill="currentColor" d="M12 11q3.75 0 6.375-1.175T21 7q0-1.65-2.625-2.825T12 3Q8.25 3 5.625 4.175T3 7q0 1.65 2.625 2.825T12 11Zm0 2.5q1.025 0 2.563-.213t2.962-.687q1.425-.475 2.45-1.237T21 9.5V12q0 1.1-1.025 1.863t-2.45 1.237q-1.425.475-2.962.688T12 16q-1.025 0-2.563-.213T6.476 15.1q-1.425-.475-2.45-1.237T3 12V9.5q0 1.1 1.025 1.863t2.45 1.237q1.425.475 2.963.688T12 13.5Zm0 5q1.025 0 2.563-.213t2.962-.687q1.425-.475 2.45-1.238T21 14.5V17q0 1.1-1.025 1.863t-2.45 1.237q-1.425.475-2.962.688T12 21q-1.025 0-2.563-.213T6.476 20.1q-1.425-.475-2.45-1.238T3 17v-2.5q0 1.1 1.025 1.863t2.45 1.237q1.425.475 2.963.688T12 18.5Z"></path></svg>
  )
}



export function CalendarInlineIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" { ...props }><path fill="currentColor" d="M5 22q-.825 0-1.413-.588T3 20V6q0-.825.588-1.413T5 4h1V2h2v2h8V2h2v2h1q.825 0 1.413.588T21 6v14q0 .825-.588 1.413T19 22H5Zm0-2h14V10H5v10Z"></path></svg>
  )
}