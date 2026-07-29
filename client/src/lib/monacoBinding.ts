import * as Y from 'yjs'
import * as monaco from 'monaco-editor'

export function bindYTextToMonaco(
  yText: Y.Text,
  model: monaco.editor.ITextModel
): () => void {
  // Initial sync from Y.Doc to Monaco
  model.setValue(yText.toString())

  // Remote changes: Y.Text → Monaco
  const observer = (event: Y.YTextEvent, transaction: Y.Transaction) => {
    if (transaction.local) return
    let index = 0
    const edits: monaco.editor.IIdentifiedSingleEditOperation[] = []
    event.changes.delta.forEach((op) => {
      if (op.retain) {
        index += op.retain
      } else if (op.delete) {
        const start = model.getPositionAt(index)
        const end = model.getPositionAt(index + op.delete)
        edits.push({
          range: new monaco.Range(
            start.lineNumber,
            start.column,
            end.lineNumber,
            end.column
          ),
          text: '',
        })
      } else if (op.insert) {
        const pos = model.getPositionAt(index)
        edits.push({
          range: new monaco.Range(pos.lineNumber, pos.column, pos.lineNumber, pos.column),
          text: op.insert as string,
        })
        index += (op.insert as string).length
      }
    })
    if (edits.length > 0) model.applyEdits(edits)
  }

  yText.observe(observer)

  // Local changes: Monaco → Y.Text
  const disposable = model.onDidChangeContent((event) => {
    Y.transact(
      yText.doc!,
      () => {
        event.changes
          .sort((a, b) => b.rangeOffset - a.rangeOffset)
          .forEach((change) => {
            if (change.rangeLength > 0) yText.delete(change.rangeOffset, change.rangeLength)
            if (change.text) yText.insert(change.rangeOffset, change.text)
          })
      },
      'local'
    )
  })

  // Cleanup
  return () => {
    yText.unobserve(observer)
    disposable.dispose()
  }
}
