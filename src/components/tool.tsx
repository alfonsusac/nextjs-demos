export function JSONStringify(p: {
  data: any
}) {
  return (<>
    <pre>
      {
        JSON.stringify(p.data, null, 4)
          ?.split('\n')
          .map((l, i) =>
            <span key={ i }>{ l.replaceAll('    ', '  . ') }
              <br />
            </span>
          )
      }
    </pre>
  </>)
}