'use client'

// import { Document, Page } from "react-pdf"
// import { pdfjs } from 'react-pdf'


// import 'react-pdf/dist/Page/TextLayer.css';
// import 'react-pdf/dist/Page/AnnotationLayer.css';

// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   'pdfjs-dist/build/pdf.worker.min.js',
//   import.meta.url,
// ).toString();


// export function PDFLoader(p: {
//   url?: string
// }) {
//   const [numPages, setNumPages] = useState(0)
//   const [pageNumber, setPageNumber] = useState(1)

//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       // https://stackoverflow.com/questions/65740268/create-react-app-how-to-copy-pdf-worker-js-file-from-pdfjs-dist-build-to-your
//       pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//         'pdfjs-dist/build/pdf.worker.min.js',
//         import.meta.url,
//       ).toString()
//     }
//   }, []);

//   if (!p.url) return <></>


//   function onDocumentLoadSuccess({ numPages }: any) {
//     setNumPages(numPages)
//     setPageNumber(pageNumber)
//   }

//   function changePage(offset: number) {
//     setPageNumber(prevPageNumber => prevPageNumber + offset)
//   }

//   function previousPage() {
//     changePage(-1)
//   }

//   function nextPage() {
//     changePage(1)
//   }

//   const url =
//     'https://www.notion.so/image/' + encodeURIComponent(p.url)
  
//   console.info(url)
  

//   return (
//     <>
//       {/* { p.url } */ }
//       <Document
//         file={ {url: p.url} }
//         onLoadSuccess={ onDocumentLoadSuccess }
//         className="overflow-hidden relative"
//         // renderMode="svg"
//         options={ {
//           httpHeaders: {
//             // Accept: '*/*',
//             // 'Access-Control-Allow-Origin': '*',
//             // ':authority': 'www.notion.so',
//             // ':method': 'GET',
//             // ':path': '/' + encodeURIComponent(p.url),
//             // 'Referer': '',
//             // 'scheme': 'https'
//           }
//         }}
//       >
//         <Page
//           pageNumber={ pageNumber }
//           className="overflow-hidden"
//         />
//         <div className="flex flex-row items-center justify-center gap-2 absolute top-4 bg-black z-50">
//           <button
//             type="button"
//             disabled={ pageNumber <= 1 }
//             onClick={ previousPage }
//             className="p-2 rounded-md hover:bg-zinc-900/70 border border-zinc-900 disabled:text-zinc-400"
//             >
//             Previous
//           </button>
//           <div>
//             Page { pageNumber || (numPages ? 1 : '--') } of { numPages || '--' }
//           </div>
//           <button
//             type="button"
//             disabled={ pageNumber >= numPages }
//             onClick={ nextPage }
//             className="p-2 rounded-md hover:bg-zinc-900/70 border border-zinc-900 disabled:text-zinc-400"
//           >
//             Next
//           </button>
//         </div>
//       </Document>
      
//     </>
//   )
// }