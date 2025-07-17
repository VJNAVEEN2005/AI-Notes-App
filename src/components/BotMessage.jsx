import React, { useState } from "react";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check, ThumbsUp, ThumbsDown, RefreshCw } from "lucide-react";

const BotMessage = ({ msg, botRefs, isTyping, onRegenerate, onFeedback }) => {
  const [copiedBlocks, setCopiedBlocks] = useState(new Set());
  const [feedback, setFeedback] = useState(null);

  const TypingIndicator = () => (
    <div className="flex gap-1 p-2">
      <div className="typing-dot w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
      <div className="typing-dot w-2 h-2 bg-orange-400 rounded-full animate-pulse delay-150"></div>
      <div className="typing-dot w-2 h-2 bg-orange-400 rounded-full animate-pulse delay-300"></div>
    </div>
  );

  const copyToClipboard = async (text, blockId) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedBlocks(prev => new Set([...prev, blockId]));
      setTimeout(() => {
        setCopiedBlocks(prev => {
          const newSet = new Set(prev);
          newSet.delete(blockId);
          return newSet;
        });
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleFeedback = (type) => {
    setFeedback(type);
    if (onFeedback) {
      onFeedback(msg.id, type);
    }
  };

  const CodeBlock = ({ node, inline, className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : 'text';
    const code = String(children).replace(/\n$/, '');
    const blockId = `${msg.id}-${Math.random()}`;

    if (!inline) {
      return (
        <div className="relative group my-4   overflow-hidden">
          <div className="flex items-center justify-between bg-gray-800 px-4 py-2 rounded-t-lg">
            <span className="text-gray-300 text-sm font-medium">
              {language.toUpperCase()}
            </span>
            <button
              onClick={() => copyToClipboard(code, blockId)}
              className="flex items-center gap-1 px-2 py-1 bg-gray-700 cursor-pointer hover:bg-gray-600 rounded text-gray-300 text-xs transition-colors flex-shrink-0"
            >
              {copiedBlocks.has(blockId) ? (
                <>
                  <Check size={12} />
                  Copied
                </>
              ) : (
                <>
                  <Copy size={12} />
                  Copy
                </>
              )}
            </button>
          </div>
          <div className="overflow-x-auto max-w-full">
            <SyntaxHighlighter
              style={oneDark}
              language={language}
              PreTag="div"
              customStyle={{
                margin: 0,
                borderRadius: '0 0 0.5rem 0.5rem',
                fontSize: '0.875rem',
                minWidth: '100%',
                width: 'max-content',
              }}
              {...props}
            >
              {code}
            </SyntaxHighlighter>
          </div>
        </div>
      );
    }

    return (
      <code
        className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-gray-800 break-all"
        {...props}
      >
        {children}
      </code>
    );
  };

  const TableComponent = ({ children }) => (
    <div className="overflow-x-auto my-4 bg-white rounded-lg shadow-sm max-w-full">
      <table className="min-w-full border-collapse">
        {children}
      </table>
    </div>
  );

  const TableHead = ({ children }) => (
    <thead className="bg-orange-100 border-b-2 border-orange-200">
      {children}
    </thead>
  );

  const TableBody = ({ children }) => (
    <tbody className="divide-y divide-gray-200">
      {children}
    </tbody>
  );

  const TableRow = ({ children }) => (
    <tr className="hover:bg-gray-50 transition-colors">
      {children}
    </tr>
  );

  const TableCell = ({ children, ...props }) => (
    <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200 last:border-r-0" {...props}>
      {children}
    </td>
  );

  const TableHeaderCell = ({ children, ...props }) => (
    <th className="px-4 py-3 text-sm font-semibold text-left text-orange-900 border-r border-orange-200 last:border-r-0" {...props}>
      {children}
    </th>
  );

  const BlockquoteComponent = ({ children }) => (
    <blockquote className="border-l-4 border-orange-400 pl-4 py-2 my-4 bg-orange-50 italic text-gray-700">
      {children}
    </blockquote>
  );

  const LinkComponent = ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-orange-600 hover:text-orange-800 underline break-words"
    >
      {children}
    </a>
  );

  const ListComponent = ({ ordered, children }) => {
    const Tag = ordered ? 'ol' : 'ul';
    return (
      <Tag className={`ml-4 my-2 ${ordered ? 'list-decimal' : 'list-disc'}`}>
        {children}
      </Tag>
    );
  };

  const ListItemComponent = ({ children }) => (
    <li className="mb-1">{children}</li>
  );

  const HeadingComponent = ({ level, children }) => {
    const sizes = {
      1: 'text-2xl font-bold mb-4 mt-6',
      2: 'text-xl font-bold mb-3 mt-5',
      3: 'text-lg font-bold mb-2 mt-4',
      4: 'text-base font-bold mb-2 mt-3',
      5: 'text-sm font-bold mb-1 mt-2',
      6: 'text-xs font-bold mb-1 mt-2',
    };

    const Tag = `h${level}`;
    return (
      <Tag className={`${sizes[level]} text-gray-800`}>
        {children}
      </Tag>
    );
  };

  return (
    <div
      key={msg.id}
      className="mb-4 left-0 text-left max-w-[70%]"
      ref={(el) => (botRefs.current[msg.id] = el)}
    >
      <div className="text-orange-900 font-semibold">Bot</div>
      <div className="rounded-2xl bg-orange-200 p-2 w-fit shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
        <div className="text-gray-700 whitespace-pre-wrap overflow-hidden">
          <Markdown
            components={{
              code: CodeBlock,
              table: TableComponent,
              thead: TableHead,
              tbody: TableBody,
              tr: TableRow,
              td: TableCell,
              th: TableHeaderCell,
              blockquote: BlockquoteComponent,
              a: LinkComponent,
              ul: ListComponent,
              ol: ListComponent,
              li: ListItemComponent,
              h1: ({ children }) => <HeadingComponent level={1}>{children}</HeadingComponent>,
              h2: ({ children }) => <HeadingComponent level={2}>{children}</HeadingComponent>,
              h3: ({ children }) => <HeadingComponent level={3}>{children}</HeadingComponent>,
              h4: ({ children }) => <HeadingComponent level={4}>{children}</HeadingComponent>,
              h5: ({ children }) => <HeadingComponent level={5}>{children}</HeadingComponent>,
              h6: ({ children }) => <HeadingComponent level={6}>{children}</HeadingComponent>,
              p: ({ children }) => <p className="mb-2 leading-relaxed break-words">{children}</p>,
              strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
              em: ({ children }) => <em className="italic">{children}</em>,
              hr: () => <hr className="border-gray-300 my-4" />,
            }}
          >
            {msg.message}
          </Markdown>
        </div>
        {msg.message === "" && isTyping && <TypingIndicator />}
      </div>
      
      {/* Message Actions */}
      {msg.message && !isTyping && (
        <div className="flex items-center gap-2 mt-2 ml-2">
          <button
            onClick={() => handleFeedback('up')}
            className={`p-1 rounded hover:bg-gray-100 transition-colors ${
              feedback === 'up' ? 'text-green-600' : 'text-gray-400'
            }`}
            title="Good response"
          >
            <ThumbsUp size={16} />
          </button>
          <button
            onClick={() => handleFeedback('down')}
            className={`p-1 rounded hover:bg-gray-100 transition-colors ${
              feedback === 'down' ? 'text-red-600' : 'text-gray-400'
            }`}
            title="Poor response"
          >
            <ThumbsDown size={16} />
          </button>
          {onRegenerate && (
            <button
              onClick={() => onRegenerate(msg.id)}
              className="p-1 rounded hover:bg-gray-100 transition-colors text-gray-400"
              title="Regenerate response"
            >
              <RefreshCw size={16} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default BotMessage;