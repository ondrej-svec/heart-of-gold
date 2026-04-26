'use client'
import { Highlight, type PrismTheme } from 'prism-react-renderer'
import React from 'react'
import { CopyButton } from './CopyButton'

type Props = {
  code: string
  language?: string
}

const rosePineTheme: PrismTheme = {
  plain: {
    color: 'var(--syn-plain)',
    backgroundColor: 'transparent',
  },
  styles: [
    { types: ['comment', 'prolog', 'doctype', 'cdata'], style: { color: 'var(--syn-comment)', fontStyle: 'italic' } },
    { types: ['keyword', 'rule', 'control', 'directive', 'unit'], style: { color: 'var(--syn-keyword)' } },
    { types: ['string', 'attr-value', 'char', 'inserted'], style: { color: 'var(--syn-string)' } },
    { types: ['number', 'boolean', 'constant', 'symbol', 'deleted'], style: { color: 'var(--syn-number)' } },
    { types: ['function', 'class-name', 'maybe-class-name', 'builtin'], style: { color: 'var(--syn-function)' } },
    { types: ['operator', 'punctuation'], style: { color: 'var(--syn-punct)' } },
    { types: ['variable', 'parameter'], style: { color: 'var(--syn-plain)' } },
    { types: ['property', 'property-access', 'attr-name'], style: { color: 'var(--syn-property)' } },
    { types: ['tag', 'selector'], style: { color: 'var(--syn-tag)' } },
    { types: ['regex', 'important'], style: { color: 'var(--syn-number)' } },
  ],
}

export const Code: React.FC<Props> = ({ code, language = '' }) => {
  if (!code) return null

  return (
    <Highlight code={code} language={language} theme={rosePineTheme}>
      {({ getLineProps, getTokenProps, tokens }) => (
        <pre
          className="p-4 border text-xs overflow-x-auto"
          style={{
            background: 'var(--code-bg)',
            borderColor: 'var(--code-border)',
            borderRadius: 0,
          }}
        >
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ className: 'table-row', line })}>
              <span className="table-cell select-none text-right opacity-40 pr-2">{i + 1}</span>
              <span className="table-cell pl-4">
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </span>
            </div>
          ))}
          <CopyButton code={code} />
        </pre>
      )}
    </Highlight>
  )
}
