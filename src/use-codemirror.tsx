import { useEffect, useRef, useState } from 'react'
import { EditorState } from '@codemirror/state'
import {
  EditorView,
  highlightActiveLine,
  highlightActiveLineGutter,
  keymap,
  lineNumbers
} from '@codemirror/view'
import {
  defaultKeymap,
  history,
  historyKeymap,
  indentWithTab
} from '@codemirror/commands'
import {
  indentOnInput,
  bracketMatching,
  syntaxHighlighting,
  HighlightStyle
} from '@codemirror/language'
import { tags } from '@lezer/highlight'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { languages } from '@codemirror/language-data'
import { oneDark } from '@codemirror/theme-one-dark'

interface Props {
  initialDoc: string
  onChange?: (state: EditorState) => void
}

export const transparentTheme = EditorView.theme({
  '&': {
    backgroundColor: 'transparent !important',
    height: '100%'
  },
  '&.cm-focused': {
    outline: 'none !important'
  },
  // '.cm-gutters': {
  //   backgroundColor: '#fff !important',
  //   color: '#181818 !important'
  // },
  '.cm-activeLineGutter': {
    backgroundColor: '#6699ff0b !important'
  }
})

const markdownHighlighting = HighlightStyle.define([
  {
    tag: tags.heading1,
    fontSize: '1.6em',
    fontWeiht: 'bold'
  },
  {
    tag: tags.heading2,
    fontSize: '1.4em',
    fontWeiht: 'bold'
  },
  {
    tag: tags.heading3,
    fontSize: '1.2em',
    fontWeiht: 'bold'
  }
])

const useCodeMirror = <T extends Element>(
  props: Props
): [React.MutableRefObject<T | null>, EditorView?] => {
  const containerRef = useRef<T>(null)
  const [editorView, setEditorView] = useState<EditorView>()
  const { onChange } = props

  useEffect(() => {
    if (!containerRef.current) return

    const startState = EditorState.create({
      doc: props.initialDoc,
      extensions: [
        keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
        lineNumbers(),
        highlightActiveLineGutter(),
        history(),
        indentOnInput(),
        bracketMatching(),
        highlightActiveLine(),
        syntaxHighlighting(markdownHighlighting),
        markdown({
          base: markdownLanguage,
          codeLanguages: languages,
          addKeymap: true
        }),
        oneDark,
        transparentTheme,
        EditorView.lineWrapping,
        EditorView.updateListener.of(update => {
          if (update.changes) {
            onChange && onChange(update.state)
          }
        })
      ]
    })

    const view = new EditorView({
      state: startState,
      parent: containerRef.current
    })
    setEditorView(view)

    return () => {
      view.destroy()
    }
  }, [containerRef])

  return [containerRef, editorView]
}

export default useCodeMirror
