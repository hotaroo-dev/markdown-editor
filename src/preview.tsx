import React, { createElement, Fragment } from 'react'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeReact from 'rehype-react'
import './preview.css'
import 'github-markdown-css'

interface Props {
  doc: string
}

const Preview: React.FC<Props> = props => {
  const md = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeReact, { createElement, Fragment })
    .processSync(props.doc).result

  return <div className="preview markdown-body">{md}</div>
}

export default Preview
