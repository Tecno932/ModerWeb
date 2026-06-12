import styles from "./index.module.css";

type Props = {
  content?: any;
  description?: string;
};

export default function ContentRenderer({
  content,
}: Props) {
  if (!content?.content) {
    return null;
  }

  const renderInline = (
    node: any,
    key: number
  ) => {
    if (node.type !== "text") {
      return null;
    }

    let element: any = node.text;

    if (node.marks) {
      node.marks.forEach(
        (mark: any) => {
          switch (mark.type) {
            case "bold":
              element = (
                <strong>
                  {element}
                </strong>
              );
              break;

            case "italic":
              element = (
                <em>{element}</em>
              );
              break;

            case "underline":
              element = (
                <u>{element}</u>
              );
              break;

            case "strike":
              element = (
                <s>{element}</s>
              );
              break;

            case "textStyle":
              element = (
                <span
                  style={{
                    color:
                      mark.attrs
                        ?.color,
                  }}
                >
                  {element}
                </span>
              );
              break;

            case "highlight":
              element = (
                <mark
                  style={{
                    background:
                      mark.attrs
                        ?.color,
                  }}
                >
                  {element}
                </mark>
              );
              break;
          }
        }
      );
    }

    return (
      <span key={key}>
        {element}
      </span>
    );
  };

  const renderParagraph = (
    block: any,
    index: number
  ) => (
    <p key={index}>
      {block.content?.map(
        (
          node: any,
          i: number
        ) =>
          renderInline(
            node,
            i
          )
      )}
    </p>
  );

  return (
    <div className={styles.content}>
      {content.content.map(
        (
          block: any,
          index: number
        ) => {
          switch (
            block.type
          ) {
            ////////////////////////////////////////////////////
            // HEADINGS
            ////////////////////////////////////////////////////

            case "heading": {
              const level =
                block.attrs
                  ?.level || 1;

              const text =
                block.content?.map(
                  (
                    c: any
                  ) => c.text
                );

              if (
                level === 1
              )
                return (
                  <h1
                    key={index}
                  >
                    {text}
                  </h1>
                );

              if (
                level === 2
              )
                return (
                  <h2
                    key={index}
                  >
                    {text}
                  </h2>
                );

              return (
                <h3
                  key={index}
                >
                  {text}
                </h3>
              );
            }

            ////////////////////////////////////////////////////
            // PARAGRAPH
            ////////////////////////////////////////////////////

            case "paragraph":
              return renderParagraph(
                block,
                index
              );

            ////////////////////////////////////////////////////
            // QUOTE
            ////////////////////////////////////////////////////

            case "quote":
              return (
                <blockquote
                  key={index}
                >
                  {block.content?.map(
                    (
                      c: any
                    ) => c.text
                  )}
                </blockquote>
              );

            ////////////////////////////////////////////////////
            // BULLET LIST
            ////////////////////////////////////////////////////

            case "bulletList":
              return (
                <ul
                  key={index}
                >
                  {block.content?.map(
                    (
                      item: any,
                      i: number
                    ) => (
                      <li
                        key={i}
                      >
                        {item
                          .content?.[0]
                          ?.content?.map(
                            (
                              c: any,
                              x: number
                            ) =>
                              renderInline(
                                c,
                                x
                              )
                          )}
                      </li>
                    )
                  )}
                </ul>
              );

            ////////////////////////////////////////////////////
            // ORDERED LIST
            ////////////////////////////////////////////////////

            case "orderedList":
              return (
                <ol
                  key={index}
                >
                  {block.content?.map(
                    (
                      item: any,
                      i: number
                    ) => (
                      <li
                        key={i}
                      >
                        {item
                          .content?.[0]
                          ?.content?.map(
                            (
                              c: any,
                              x: number
                            ) =>
                              renderInline(
                                c,
                                x
                              )
                          )}
                      </li>
                    )
                  )}
                </ol>
              );

            ////////////////////////////////////////////////////
            // CODE
            ////////////////////////////////////////////////////

            case "codeBlock":
              return (
                <pre
                  key={index}
                  className={
                    styles.code
                  }
                >
                  <code>
                    {block.content?.map(
                      (
                        c: any
                      ) =>
                        c.text
                    )}
                  </code>
                </pre>
              );

            ////////////////////////////////////////////////////
            // IMAGE
            ////////////////////////////////////////////////////

            case "image":
              return (
                <img
                  key={index}
                  src={
                    block
                      .attrs
                      ?.src
                  }
                  alt={
                    block
                      .attrs
                      ?.alt ||
                    ""
                  }
                />
              );

            ////////////////////////////////////////////////////
            // SPOILER
            ////////////////////////////////////////////////////

            case "spoiler":
            case "accordion":
              return (
                <details
                  key={index}
                  className={
                    styles.details
                  }
                >
                  <summary>
                    {block
                      .attrs
                      ?.title ||
                      "Expandir"}
                  </summary>

                  <div>
                    {block.content?.map(
                      (
                        p: any,
                        i: number
                      ) => (
                        <p
                          key={
                            i
                          }
                        >
                          {p
                            .content?.map(
                              (
                                c: any
                              ) =>
                                c.text
                            )}
                        </p>
                      )
                    )}
                  </div>
                </details>
              );

            ////////////////////////////////////////////////////
            // CALLOUT
            ////////////////////////////////////////////////////

            case "callout":
              return (
                <div
                  key={index}
                  className={`${styles.callout} ${styles[block.attrs?.variant]}`}
                >
                  {block.content?.map(
                    (
                      c: any
                    ) => c.text
                  )}
                </div>
              );

            ////////////////////////////////////////////////////
            // DIVIDER
            ////////////////////////////////////////////////////

            case "divider":
              return (
                <hr
                  key={index}
                />
              );

            ////////////////////////////////////////////////////
            // TABLE
            ////////////////////////////////////////////////////

            case "table":
              return (
                <table
                  key={index}
                  className={
                    styles.table
                  }
                >
                  <tbody>
                    {block.content?.map(
                      (
                        row: any,
                        r: number
                      ) => (
                        <tr
                          key={
                            r
                          }
                        >
                          {row.cells?.map(
                            (
                              cell: string,
                              c: number
                            ) => (
                              <td
                                key={
                                  c
                                }
                              >
                                {
                                  cell
                                }
                              </td>
                            )
                          )}
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              );

            default:
              return (
                <div
                  key={index}
                  className={
                    styles.unsupported
                  }
                >
                  Unsupported:
                  {" "}
                  {block.type}
                </div>
              );
          }
        }
      )}
    </div>
  );
}