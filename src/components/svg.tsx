
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


export function DatabasePage(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" { ...props }><path fill="currentColor" d="M12 21q-3.775 0-6.388-1.163T3 17V7q0-1.65 2.638-2.825T12 3q3.725 0 6.363 1.175T21 7v10q0 1.675-2.613 2.838T12 21Zm0-11.975q2.225 0 4.475-.638T19 7.025q-.275-.725-2.513-1.375T12 5q-2.275 0-4.463.638T5 7.024q.35.75 2.538 1.375T12 9.025ZM12 14q1.05 0 2.025-.1t1.863-.288q.887-.187 1.675-.462T19 12.525v-3q-.65.35-1.438.625t-1.675.463q-.887.187-1.862.287T12 11q-1.05 0-2.05-.1t-1.888-.288q-.887-.187-1.662-.462T5 9.525v3q.625.35 1.4.625t1.663.463q.887.187 1.887.287T12 14Zm0 5q1.15 0 2.337-.175t2.188-.463q1-.287 1.675-.65t.8-.737v-2.45q-.65.35-1.438.625t-1.675.463q-.887.187-1.862.287T12 16q-1.05 0-2.05-.1t-1.888-.288q-.887-.187-1.662-.462T5 14.525V17q.125.375.788.725t1.662.638q1 .287 2.2.462T12 19Z"></path></svg>
  )
}